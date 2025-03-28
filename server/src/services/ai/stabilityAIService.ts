import axios from 'axios';
import config from '../../config';

// Stability AI API base URL
const STABILITY_API_BASE_URL = 'https://api.stability.ai/v1';

// Use correct environment variable
const apiKey = process.env.STABILITY_API_KEY;

/**
 * Generate logo using Stability AI API
 * @param prompt - Text description of the logo
 * @param style - Logo style (minimalist, vintage, modern, etc.)
 * @param colorScheme - Array of color hex values
 * @param size - Size of the logo (small, medium, large)
 * @returns Buffer containing the generated image
 */
export const generateStabilityAILogo = async (
  prompt: string,
  style: string = 'minimalist',
  colorScheme: string[] = ['#000000', '#FFFFFF'],
  size: string = 'medium'
): Promise<Buffer> => {
  try {
    // Enhanced prompt with style and colors
    const enhancedPrompt = `Professional vector logo design for ${prompt}. Clean ${style} style with ${colorScheme.join(', ')} colors. Minimalist, scalable, business logo on white background. No text or typography.`;
    
    // Negative prompt to avoid unwanted elements
    const negativePrompt = "low quality, blurry, amateur, poorly drawn, ugly, text, words, typography, letters";
    
    // Map size to valid SDXL dimensions
    let width, height;
    switch (size) {
      case 'small':
        width = 768;
        height = 1344;
        break;
      case 'medium':
        width = 1024;
        height = 1024;
        break;
      case 'large':
      default:
        width = 1152;
        height = 896;
        break;
    }
    
    console.log(`Calling Stability AI with dimensions: ${width}x${height}`);
    
    // Call Stability AI API to generate the logo
    const response = await axios.post(
      `${STABILITY_API_BASE_URL}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
      {
        text_prompts: [
          {
            text: enhancedPrompt,
            weight: 1
          },
          {
            text: negativePrompt,
            weight: -1
          }
        ],
        cfg_scale: 7.5,
        clip_guidance_preset: 'SIMPLE', // Use valid preset
        height,
        width,
        samples: 1,
        steps: 30
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );
    
    // Check if response has the expected structure
    if (
      !response.data ||
      !response.data.artifacts ||
      response.data.artifacts.length === 0
    ) {
      throw new Error('Invalid response from Stability AI');
    }
    
    // Get base64 encoded image from the response
    const base64Image = response.data.artifacts[0].base64;
    
    // Convert base64 to Buffer
    return Buffer.from(base64Image, 'base64');
  } catch (error: any) {
    console.error('Stability AI API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 400) {
      throw new Error(`Logo generation parameters invalid: ${error.response?.data?.message || 'Unknown validation error'}`);
    } else if (error.response?.status === 401) {
      throw new Error('API key invalid or expired');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded for Stability AI');
    } else {
      throw new Error(`Failed to generate logo: ${error.message}`);
    }
  }
};