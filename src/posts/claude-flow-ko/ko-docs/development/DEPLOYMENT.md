# 🚀 Production 배포 가이드

## 📋 목차

- [시스템 요구사항](#시스템-요구사항)
- [환경 변수](#환경-변수)
- [Docker 배포](#docker-배포)
- [Kubernetes 배포](#kubernetes-배포)
- [CI/CD Pipeline](#cicd-pipeline)
- [모니터링 및 로깅](#모니터링-및-로깅)
- [보안 구성](#보안-구성)
- [백업 및 복구](#백업-및-복구)
- [확장성](#확장성)
- [문제 해결](#문제-해결)

---

## 시스템 요구사항

### 하드웨어 요구사항

#### 최소 사양
- **CPU**: 2 코어
- **RAM**: 4GB
- **디스크**: 20GB SSD
- **네트워크**: 100 Mbps

#### 권장 사양 (Production)
- **CPU**: 4+ 코어
- **RAM**: 16GB+
- **디스크**: 100GB+ SSD (NVMe 권장)
- **네트워크**: 1 Gbps+

#### 대규모 배포
- **CPU**: 8+ 코어
- **RAM**: 32GB+
- **디스크**: 500GB+ NVMe SSD
- **네트워크**: 10 Gbps+

### 소프트웨어 요구사항

- **운영체제**:
  - Ubuntu 20.04+ LTS
  - Debian 11+
  - RHEL 8+
  - Amazon Linux 2
- **Node.js**: 18.x LTS 이상
- **npm**: 9.x 이상
- **Claude Code**: 최신 버전
- **Git**: 2.x 이상

### 네트워크 요구사항

- **인바운드 포트**:
  - 443 (HTTPS) - API 액세스
  - 22 (SSH) - 관리 액세스
- **아웃바운드 포트**:
  - 443 (HTTPS) - Anthropic API, npm registry
  - 80 (HTTP) - Package 업데이트
- **방화벽**: Docker/Kubernetes network policy 필요

---

## 환경 변수

### 필수 변수

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/claude_flow
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-secure-random-string
ENCRYPTION_KEY=your-32-byte-encryption-key
SESSION_SECRET=your-session-secret

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 선택적 변수

```bash
# Feature Flags
ENABLE_TELEMETRY=true
ENABLE_NEURAL_TRAINING=true
ENABLE_DISTRIBUTED_MEMORY=true

# Performance
MAX_WORKERS=4
WORKER_TIMEOUT=300000
MEMORY_LIMIT=2048

# Integrations
GITHUB_TOKEN=ghp_xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxx

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
METRICS_INTERVAL=60000

# Storage
S3_BUCKET=claude-flow-storage
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

### 환경별 구성

```bash
# Development
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_HOT_RELOAD=true

# Staging
NODE_ENV=staging
LOG_LEVEL=info
RATE_LIMIT=100

# Production
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT=1000
ENABLE_CACHING=true
```

---

## Docker 배포

### Dockerfile

```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  claude-flow:
    build: .
    container_name: claude-flow
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/claude_flow
      - REDIS_URL=redis://redis:6379
    env_file:
      - .env.production
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
      - ./data:/app/data
    networks:
      - claude-flow-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    image: postgres:15-alpine
    container_name: claude-flow-db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=claude_flow
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - claude-flow-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: claude-flow-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - claude-flow-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    container_name: claude-flow-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - claude-flow-network

  grafana:
    image: grafana/grafana:latest
    container_name: claude-flow-grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=redis-datasource
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on:
      - prometheus
    networks:
      - claude-flow-network

networks:
  claude-flow-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  prometheus-data:
  grafana-data:
```

### 배포 명령어

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f claude-flow

# Scale service
docker-compose up -d --scale claude-flow=3

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

---

## Kubernetes 배포

### Namespace 생성

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: claude-flow
  labels:
    name: claude-flow
    environment: production
```

### ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: claude-flow-config
  namespace: claude-flow
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  LOG_FORMAT: "json"
  ENABLE_TELEMETRY: "true"
  MAX_WORKERS: "4"
  PROMETHEUS_PORT: "9090"
```

### Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: claude-flow-secrets
  namespace: claude-flow
type: Opaque
stringData:
  ANTHROPIC_API_KEY: "sk-ant-xxxxx"
  DATABASE_URL: "postgresql://user:pass@db:5432/claude_flow"
  REDIS_URL: "redis://redis:6379"
  JWT_SECRET: "your-secure-random-string"
  ENCRYPTION_KEY: "your-32-byte-encryption-key"
```

### Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claude-flow
  namespace: claude-flow
  labels:
    app: claude-flow
    version: v2.7.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: claude-flow
  template:
    metadata:
      labels:
        app: claude-flow
        version: v2.7.0
    spec:
      containers:
      - name: claude-flow
        image: your-registry/claude-flow:2.7.0
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
        - containerPort: 9090
          name: metrics
        env:
        - name: PORT
          value: "3000"
        envFrom:
        - configMapRef:
            name: claude-flow-config
        - secretRef:
            name: claude-flow-secrets
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: data
          mountPath: /app/data
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: claude-flow-data
      - name: logs
        emptyDir: {}
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - claude-flow
              topologyKey: kubernetes.io/hostname
```

### Service

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: claude-flow
  namespace: claude-flow
  labels:
    app: claude-flow
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  - port: 9090
    targetPort: 9090
    protocol: TCP
    name: metrics
  selector:
    app: claude-flow
```

### Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: claude-flow
  namespace: claude-flow
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.claude-flow.com
    secretName: claude-flow-tls
  rules:
  - host: api.claude-flow.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: claude-flow
            port:
              number: 80
```

### HorizontalPodAutoscaler

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: claude-flow
  namespace: claude-flow
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: claude-flow
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 2
        periodSeconds: 60
```

### PersistentVolumeClaim

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claude-flow-data
  namespace: claude-flow
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: aws-efs
  resources:
    requests:
      storage: 100Gi
```

### 배포 스크립트

```bash
#!/bin/bash
# deploy.sh

set -e

NAMESPACE="claude-flow"
VERSION="2.7.0"

echo "🚀 Deploying Claude-Flow v${VERSION} to Kubernetes..."

# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/pvc.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Wait for rollout
echo "⏳ Waiting for deployment to complete..."
kubectl rollout status deployment/claude-flow -n ${NAMESPACE} --timeout=5m

# Verify deployment
echo "✅ Verifying deployment..."
kubectl get pods -n ${NAMESPACE} -l app=claude-flow

echo "🎉 Deployment complete!"
echo "📊 Access Grafana: http://grafana.claude-flow.com"
echo "📈 Access Prometheus: http://prometheus.claude-flow.com"
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy-production.yml
name: 🚀 Deploy to Production

on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}

jobs:
  build:
    name: 🏗️ Build Docker Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔐 Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 🏷️ Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: 🏗️ Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  test:
    name: 🧪 Run Tests
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🧪 Run unit tests
        run: npm run test:unit

      - name: 🔗 Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379

      - name: 📊 Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  security:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔍 Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: 📤 Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  deploy:
    name: 🚀 Deploy to Kubernetes
    runs-on: ubuntu-latest
    needs: [build, test, security]
    environment:
      name: production
      url: https://api.claude-flow.com

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: ⚙️ Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

      - name: 🔄 Update deployment
        run: |
          kubectl set image deployment/claude-flow \
            claude-flow=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n claude-flow

      - name: ⏳ Wait for rollout
        run: |
          kubectl rollout status deployment/claude-flow \
            -n claude-flow \
            --timeout=5m

      - name: ✅ Verify deployment
        run: |
          kubectl get pods -n claude-flow -l app=claude-flow

  notify:
    name: 📢 Notify Team
    runs-on: ubuntu-latest
    needs: [deploy]
    if: always()

    steps:
      - name: 📬 Send Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            🚀 Deployment to Production: ${{ job.status }}
            📦 Version: ${{ github.sha }}
            👤 Author: ${{ github.actor }}
            🔗 Workflow: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

---

## 모니터링 및 로깅

### Prometheus 구성

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'claude-flow-prod'
    environment: 'production'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

scrape_configs:
  - job_name: 'claude-flow'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - claude-flow
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: claude-flow
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: pod
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: namespace

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Claude-Flow Production Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Active Swarms",
        "targets": [
          {
            "expr": "claude_flow_active_swarms"
          }
        ]
      }
    ]
  }
}
```

### Logging 구성

```javascript
// config/logger.js
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'claude-flow',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // File output
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 10
    }),

    // Elasticsearch (production)
    ...(process.env.NODE_ENV === 'production' ? [
      new ElasticsearchTransport({
        level: 'info',
        clientOpts: {
          node: process.env.ELASTICSEARCH_URL,
          auth: {
            username: process.env.ELASTICSEARCH_USER,
            password: process.env.ELASTICSEARCH_PASSWORD
          }
        },
        index: 'claude-flow-logs'
      })
    ] : [])
  ]
});

export default logger;
```

---

## 보안 구성

### Secrets 관리

```bash
# Using Kubernetes Secrets
kubectl create secret generic claude-flow-secrets \
  --from-literal=anthropic-api-key=$ANTHROPIC_API_KEY \
  --from-literal=database-url=$DATABASE_URL \
  --from-literal=jwt-secret=$JWT_SECRET \
  -n claude-flow

# Using AWS Secrets Manager
aws secretsmanager create-secret \
  --name claude-flow/production/api-keys \
  --secret-string '{
    "anthropic_api_key": "sk-ant-xxxxx",
    "jwt_secret": "xxxxx"
  }'

# Using HashiCorp Vault
vault kv put secret/claude-flow/production \
  anthropic_api_key=sk-ant-xxxxx \
  database_url=postgresql://... \
  jwt_secret=xxxxx
```

### Network Policy

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: claude-flow-network-policy
  namespace: claude-flow
spec:
  podSelector:
    matchLabels:
      app: claude-flow
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
    - from:
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 9090
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: claude-flow
      ports:
        - protocol: TCP
          port: 5432
        - protocol: TCP
          port: 6379
    - to:
        - podSelector: {}
      ports:
        - protocol: TCP
          port: 53
        - protocol: UDP
          port: 53
```

### WAF 구성

```yaml
# waf-rules.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: claude-flow
  annotations:
    nginx.ingress.kubernetes.io/enable-modsecurity: "true"
    nginx.ingress.kubernetes.io/enable-owasp-core-rules: "true"
    nginx.ingress.kubernetes.io/modsecurity-snippet: |
      SecRuleEngine On
      SecRequestBodyLimit 13107200
      SecRule ARGS "@contains <script>" "id:1,deny,status:403,msg:'XSS Attack'"
      SecRule ARGS "@contains .." "id:2,deny,status:403,msg:'Path Traversal'"
```

---

## 백업 및 복구

### Database 백업

```bash
#!/bin/bash
# scripts/backup-database.sh

set -e

BACKUP_DIR="/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="claude_flow_${TIMESTAMP}.sql.gz"

# Create backup
pg_dump -h localhost -U postgres claude_flow | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

# Upload to S3
aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" \
  s3://claude-flow-backups/postgresql/${BACKUP_FILE}

# Clean up old backups (keep last 30 days)
find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: ${BACKUP_FILE}"
```

### Automated 백업 (Kubernetes CronJob)

```yaml
# cronjob-backup.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: claude-flow-backup
  namespace: claude-flow
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  successfulJobsHistoryLimit: 7
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: claude-flow-secrets
                  key: database-password
            command:
            - /bin/sh
            - -c
            - |
              TIMESTAMP=$(date +%Y%m%d_%H%M%S)
              BACKUP_FILE="claude_flow_${TIMESTAMP}.sql.gz"

              pg_dump -h postgres -U postgres claude_flow | gzip > /tmp/${BACKUP_FILE}

              aws s3 cp /tmp/${BACKUP_FILE} s3://claude-flow-backups/postgresql/${BACKUP_FILE}

              echo "Backup completed: ${BACKUP_FILE}"
            volumeMounts:
            - name: backup-storage
              mountPath: /tmp
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure
```

### 복구 절차

```bash
#!/bin/bash
# scripts/restore-database.sh

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file>"
  exit 1
fi

# Download from S3
aws s3 cp "s3://claude-flow-backups/postgresql/${BACKUP_FILE}" /tmp/

# Restore database
gunzip < "/tmp/${BACKUP_FILE}" | psql -h localhost -U postgres claude_flow

echo "✅ Database restored from: ${BACKUP_FILE}"
```

---

## 확장성

### Horizontal Scaling

```bash
# Scale deployment
kubectl scale deployment claude-flow --replicas=10 -n claude-flow

# Autoscaling based on metrics
kubectl autoscale deployment claude-flow \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n claude-flow
```

### Database Connection Pooling

```javascript
// config/database.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum pool size
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false
  }
});

// Health check
pool.on('error', (err) => {
  console.error('Unexpected database error', err);
  process.exit(-1);
});

export default pool;
```

### Redis Caching

```javascript
// config/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  autoResendUnfulfilledCommands: true
});

// Cache helper
export async function cacheGet(key) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet(key, value, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value));
}

export default redis;
```

---

## 문제 해결

### 일반적인 문제

#### 1. Pod가 시작되지 않음

```bash
# Check pod status
kubectl get pods -n claude-flow

# View pod logs
kubectl logs <pod-name> -n claude-flow

# Describe pod for events
kubectl describe pod <pod-name> -n claude-flow

# Check resource limits
kubectl top pods -n claude-flow
```

#### 2. Database 연결 실패

```bash
# Test database connectivity
kubectl run -it --rm debug \
  --image=postgres:15-alpine \
  --restart=Never \
  -- psql -h postgres -U postgres -d claude_flow

# Check database logs
kubectl logs -n claude-flow -l app=postgres

# Verify secrets
kubectl get secret claude-flow-secrets -n claude-flow -o yaml
```

#### 3. 높은 메모리 사용량

```bash
# Check memory usage
kubectl top pods -n claude-flow

# Analyze heap dump
node --expose-gc --inspect app.js

# Increase memory limit
kubectl set resources deployment claude-flow \
  --limits=memory=8Gi \
  -n claude-flow
```

#### 4. Ingress 문제

```bash
# Check ingress status
kubectl get ingress -n claude-flow

# View nginx logs
kubectl logs -n ingress-nginx -l app=ingress-nginx

# Test endpoint
curl -v https://api.claude-flow.com/health
```

### Performance 최적화

```javascript
// Enable clustering
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Start application
  import('./app.js');
}
```

### 모니터링 Alert

```yaml
# alerting-rules.yaml
groups:
  - name: claude-flow-alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"

      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes{pod=~"claude-flow-.*"} > 3.5e9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanize }}B"

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod is crash looping"
          description: "Pod {{ $labels.pod }} is restarting"
```

---

## Cloud 플랫폼별 배포

### AWS EKS

```bash
# Create EKS cluster
eksctl create cluster \
  --name claude-flow-prod \
  --version 1.28 \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.large \
  --nodes 3 \
  --nodes-min 3 \
  --nodes-max 10 \
  --managed

# Configure kubectl
aws eks update-kubeconfig --name claude-flow-prod --region us-east-1

# Deploy application
kubectl apply -k k8s/overlays/production
```

### GCP GKE

```bash
# Create GKE cluster
gcloud container clusters create claude-flow-prod \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-4 \
  --enable-autoscaling \
  --min-nodes 3 \
  --max-nodes 10

# Get credentials
gcloud container clusters get-credentials claude-flow-prod \
  --zone us-central1-a

# Deploy application
kubectl apply -k k8s/overlays/production
```

### Azure AKS

```bash
# Create AKS cluster
az aks create \
  --resource-group claude-flow-rg \
  --name claude-flow-prod \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-cluster-autoscaler \
  --min-count 3 \
  --max-count 10 \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group claude-flow-rg \
  --name claude-flow-prod

# Deploy application
kubectl apply -k k8s/overlays/production
```

### Heroku

```bash
# Create Heroku app
heroku create claude-flow-prod

# Set environment variables
heroku config:set \
  NODE_ENV=production \
  ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  DATABASE_URL=$DATABASE_URL

# Add buildpacks
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main

# Scale dynos
heroku ps:scale web=3:standard-2x

# View logs
heroku logs --tail
```

---

## 추가 리소스

- [Kubernetes 문서](https://kubernetes.io/docs/)
- [Docker 문서](https://docs.docker.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Prometheus 문서](https://prometheus.io/docs/)
- [Grafana 문서](https://grafana.com/docs/)

---

**문서 버전**: 2.7.0
**마지막 업데이트**: 2025-01-15
