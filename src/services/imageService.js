export class ImageService {
  static async generateCharacterImage(mbtiType, characterCode, scores = {}, gender = 'neutral', occupation = null) {
    try {
      const response = await fetch('/api/generate-character-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbtiType,
          characterCode,
          scores,
          gender,
          occupation
        })
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.success) {
        console.warn('AI image generation failed, using fallback:', data.error);
        return {
          success: false,
          error: data.error,
          imageUrl: data.alternativeUrl || null,
          source: 'fallback',
          characterCode: data.characterCode || characterCode
        };
      }

      return {
        success: true,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        source: data.source || 'dall-e-3',
        characterCode: data.characterCode || characterCode
      };

    } catch (error) {
      console.error('Character image generation error:', error);
      return {
        success: false,
        error: error.message,
        imageUrl: null,
        source: 'error',
        characterCode: characterCode
      };
    }
  }
}