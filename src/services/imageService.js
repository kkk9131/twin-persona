export class ImageService {
  static async generateCharacterImage(mbtiType, characterType, scores = {}, gender = 'neutral') {
    try {
      const response = await fetch('/api/generate-character-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbtiType,
          characterType,
          scores,
          gender
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
          source: 'fallback'
        };
      }

      return {
        success: true,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        source: data.source || 'dall-e-3'
      };

    } catch (error) {
      console.error('Character image generation error:', error);
      return {
        success: false,
        error: error.message,
        imageUrl: null,
        source: 'error'
      };
    }
  }
}