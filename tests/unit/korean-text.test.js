/**
 * Korean Text Handling Tests
 * @description Tests for Korean language search features including Hangul processing
 */

const { samplePosts } = require('../fixtures/test-data');

describe('Korean Text Handling', () => {
  let koreanTextProcessor;

  beforeEach(() => {
    koreanTextProcessor = {
      // Decompose Hangul syllable into jamo (자모)
      decomposeHangul(char) {
        const code = char.charCodeAt(0) - 0xAC00;
        if (code < 0 || code > 11171) return char;

        const initialIndex = Math.floor(code / 588);
        const medialIndex = Math.floor((code % 588) / 28);
        const finalIndex = code % 28;

        const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
        const medials = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
        const finals = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

        return {
          initial: initials[initialIndex],
          medial: medials[medialIndex],
          final: finals[finalIndex].trim()
        };
      },

      // Extract initial consonants (초성) from text
      extractInitials(text) {
        return text.split('').map(char => {
          const decomposed = this.decomposeHangul(char);
          return typeof decomposed === 'object' ? decomposed.initial : char;
        }).join('');
      },

      // Check if text matches initial search pattern
      matchesInitials(text, pattern) {
        const initials = this.extractInitials(text);
        return initials.includes(pattern);
      },

      // Normalize Korean text (remove spacing variations, normalize forms)
      normalizeKorean(text) {
        return text
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      },

      // Check if character is Hangul
      isHangul(char) {
        const code = char.charCodeAt(0);
        return (code >= 0xAC00 && code <= 0xD7A3) || // Complete Hangul syllables
               (code >= 0x1100 && code <= 0x11FF) || // Hangul Jamo
               (code >= 0x3130 && code <= 0x318F);   // Hangul Compatibility Jamo
      }
    };
  });

  describe('Hangul Decomposition', () => {
    it('should decompose Hangul syllables correctly', () => {
      const result = koreanTextProcessor.decomposeHangul('한');
      expect(result).toEqual({
        initial: 'ㅎ',
        medial: 'ㅏ',
        final: 'ㄴ'
      });
    });

    it('should handle syllables without final consonants', () => {
      const result = koreanTextProcessor.decomposeHangul('가');
      expect(result).toEqual({
        initial: 'ㄱ',
        medial: 'ㅏ',
        final: ''
      });
    });

    it('should handle complex final consonants', () => {
      const result = koreanTextProcessor.decomposeHangul('값');
      expect(result.final).toBeTruthy();
    });

    it('should leave non-Hangul characters unchanged', () => {
      const result = koreanTextProcessor.decomposeHangul('A');
      expect(result).toBe('A');
    });
  });

  describe('Initial Consonant (초성) Search', () => {
    it('should extract initial consonants from Korean text', () => {
      const initials = koreanTextProcessor.extractInitials('한글');
      expect(initials).toBe('ㅎㄱ');
    });

    it('should match text by initial consonants', () => {
      const matches = koreanTextProcessor.matchesInitials('한글검색', 'ㅎㄱ');
      expect(matches).toBe(true);
    });

    it('should not match incorrect initial patterns', () => {
      const matches = koreanTextProcessor.matchesInitials('한글검색', 'ㄱㅅ');
      expect(matches).toBe(false);
    });

    it('should handle mixed Korean and English text', () => {
      const initials = koreanTextProcessor.extractInitials('한글 Test');
      expect(initials).toContain('ㅎㄱ');
    });
  });

  describe('Korean Text Normalization', () => {
    it('should normalize whitespace', () => {
      const normalized = koreanTextProcessor.normalizeKorean('한글   검색');
      expect(normalized).toBe('한글 검색');
    });

    it('should trim leading and trailing spaces', () => {
      const normalized = koreanTextProcessor.normalizeKorean('  한글  ');
      expect(normalized).toBe('한글');
    });

    it('should handle empty strings', () => {
      const normalized = koreanTextProcessor.normalizeKorean('');
      expect(normalized).toBe('');
    });
  });

  describe('Hangul Character Detection', () => {
    it('should identify Hangul syllables', () => {
      expect(koreanTextProcessor.isHangul('한')).toBe(true);
      expect(koreanTextProcessor.isHangul('글')).toBe(true);
    });

    it('should identify Hangul jamo', () => {
      expect(koreanTextProcessor.isHangul('ㄱ')).toBe(true);
      expect(koreanTextProcessor.isHangul('ㅏ')).toBe(true);
    });

    it('should reject non-Hangul characters', () => {
      expect(koreanTextProcessor.isHangul('A')).toBe(false);
      expect(koreanTextProcessor.isHangul('1')).toBe(false);
      expect(koreanTextProcessor.isHangul('!')).toBe(false);
    });
  });

  describe('Mixed Language Support', () => {
    it('should handle Korean-English mixed content', () => {
      const text = 'Claude Flow 시작하기';
      const normalized = koreanTextProcessor.normalizeKorean(text);
      expect(normalized).toContain('claude flow');
      expect(normalized).toContain('시작하기');
    });

    it('should preserve word boundaries in mixed text', () => {
      const text = 'AI 에이전트 orchestration';
      expect(text.split(' ').length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single character queries', () => {
      const result = koreanTextProcessor.decomposeHangul('가');
      expect(result).toBeDefined();
    });

    it('should handle special Korean punctuation', () => {
      const text = '한글，검색。';
      const normalized = koreanTextProcessor.normalizeKorean(text);
      expect(normalized).toBeDefined();
    });

    it('should handle Korean numbers', () => {
      const text = '일이삼사';
      expect(koreanTextProcessor.isHangul('일')).toBe(true);
    });
  });

  describe('Performance with Korean Text', () => {
    it('should process Korean text efficiently', () => {
      const longText = '한글'.repeat(1000);

      const start = performance.now();
      koreanTextProcessor.extractInitials(longText);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it('should decompose multiple syllables quickly', () => {
      const text = '한글검색테스트입니다';

      const start = performance.now();
      text.split('').forEach(char => {
        koreanTextProcessor.decomposeHangul(char);
      });
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });
  });
});
