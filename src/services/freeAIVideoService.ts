import { Scene, VideoProject } from '../types';

// Free AI Video Generation Services
export interface FreeAIVideoConfig {
  // Hugging Face Inference API (Free tier)
  hfApiKey?: string;
  
  // Replicate API (Free credits)
  replicateApiKey?: string;
  
  // Local models (via transformers.js or ONNX)
  useLocalModels?: boolean;
}

// Available free models for video generation
export const FREE_VIDEO_MODELS = {
  // Text-to-Video models
  textToVideo: {
    'modelscope-damo': {
      name: 'ModelScope DAMO Text-to-Video',
      provider: 'Hugging Face',
      modelId: 'damo-vilab/modelscope-damo-text-to-video-synthesis',
      maxDuration: 16, // seconds
      resolution: '320x240', // Low res but free
      cost: 'Free (Hugging Face Inference API)'
    },
    'zeroscope-v2': {
      name: 'ZeroScope V2',
      provider: 'Hugging Face',
      modelId: 'cerspense/zeroscope_v2_576w',
      maxDuration: 3, // seconds
      resolution: '576x320',
      cost: 'Free (Hugging Face Inference API)'
    },
    'animate-diff': {
      name: 'AnimateDiff',
      provider: 'Hugging Face / Replicate',
      modelId: 'guoyww/animatediff-motion-adapter-v1-5-2',
      maxDuration: 4,
      resolution: '512x512',
      cost: 'Free (Hugging Face / Replicate free credits)'
    }
  },
  
  // Image-to-Video models
  imageToVideo: {
    'stable-video-diffusion': {
      name: 'Stable Video Diffusion',
      provider: 'Replicate / Hugging Face',
      modelId: 'stabilityai/stable-video-diffusion-img2vid-xt',
      maxDuration: 4,
      resolution: '576x1024',
      cost: 'Free (Replicate free credits / Hugging Face)'
    },
    'svd-xt': {
      name: 'SVD-XT',
      provider: 'Replicate',
      modelId: 'stabilityai/stable-video-diffusion-img2vid-xt-1-1',
      maxDuration: 4,
      resolution: '576x1024',
      cost: 'Free (Replicate free credits)'
    }
  },
  
  // Text-to-Image models (for generating scene images)
  textToImage: {
    'sdxl-turbo': {
      name: 'SDXL Turbo',
      provider: 'Hugging Face',
      modelId: 'stabilityai/sdxl-turbo',
      resolution: '512x512',
      cost: 'Free (Hugging Face Inference API)'
    },
    'flux-schnell': {
      name: 'Flux Schnell',
      provider: 'Hugging Face',
      modelId: 'black-forest-labs/FLUX.1-schnell',
      resolution: '1024x1024',
      cost: 'Free (Hugging Face Inference API - limited)'
    },
    'playground-v2': {
      name: 'Playground v2.5',
      provider: 'Hugging Face',
      modelId: 'playgroundai/playground-v2.5-1024px-aesthetic',
      resolution: '1024x1024',
      cost: 'Free (Hugging Face Inference API)'
    }
  }
};

// Generate images for scenes using free text-to-image APIs
export async function generateSceneImages(
  project: VideoProject,
  config: FreeAIVideoConfig
): Promise<Map<string, string>> {
  const imageUrls = new Map<string, string>();
  
  for (const scene of project.scenes) {
    if (scene.aiImagePrompt) {
      try {
        // Try Hugging Face Inference API first
        if (config.hfApiKey) {
          const imageUrl = await generateImageHF(scene.aiImagePrompt, config.hfApiKey);
          if (imageUrl) {
            imageUrls.set(scene.id, imageUrl);
            continue;
          }
        }
        
        // Fallback to Replicate
        if (config.replicateApiKey) {
          const imageUrl = await generateImageReplicate(scene.aiImagePrompt, config.replicateApiKey);
          if (imageUrl) {
            imageUrls.set(scene.id, imageUrl);
            continue;
          }
        }
        
        // Fallback to placeholder/Unsplash
        const placeholderUrl = generatePlaceholderImage(scene.aiImagePrompt, project.productName);
        imageUrls.set(scene.id, placeholderUrl);
      } catch (error) {
        console.warn(`Failed to generate image for scene ${scene.id}:`, error);
        const placeholderUrl = generatePlaceholderImage(scene.aiImagePrompt, project.productName);
        imageUrls.set(scene.id, placeholderUrl);
      }
    }
  }
  
  return imageUrls;
}

// Generate image using Hugging Face Inference API
async function generateImageHF(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${prompt}, vertical 9:16 aspect ratio, high quality, commercial product photography`,
          parameters: {
            negative_prompt: 'blurry, low quality, distorted, ugly, horizontal, landscape',
            width: 576,
            height: 1024,
            num_inference_steps: 4, // SDXL Turbo only needs 1-4 steps
            guidance_scale: 0,
          }
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Hugging Face image generation failed:', error);
    return null;
  }
}

// Generate image using Replicate API
async function generateImageReplicate(prompt: string, apiKey: string): Promise<string | null> {
  try {
    // Start prediction
    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt: `${prompt}, vertical 9:16 aspect ratio, high quality, commercial product photography`,
          negative_prompt: 'blurry, low quality, distorted, ugly, horizontal, landscape',
          width: 576,
          height: 1024,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        }
      }),
    });
    
    if (!startResponse.ok) {
      throw new Error(`Replicate start error: ${startResponse.status}`);
    }
    
    const prediction = await startResponse.json();
    
    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      });
      result = await pollResponse.json();
    }
    
    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      return result.output[0];
    }
    
    throw new Error(`Replicate prediction failed: ${result.error}`);
  } catch (error) {
    console.error('Replicate image generation failed:', error);
    return null;
  }
}

// Generate video from images using free video generation models
export async function generateVideoFromImages(
  imageUrls: string[],
  project: VideoProject,
  config: FreeAIVideoConfig
): Promise<string | null> {
  // For now, we'll use the existing canvas-based rendering
  // In the future, we can integrate with:
  // - Stable Video Diffusion (image-to-video)
  // - AnimateDiff (for adding motion to static images)
  // - ModelScope (text-to-video)
  
  // This would be implemented based on the chosen model
  console.log('Video generation from images would use:', imageUrls.length, 'images');
  return null;
}

// Generate video directly from text prompt using free models
export async function generateVideoFromText(
  prompt: string,
  config: FreeAIVideoConfig
): Promise<string | null> {
  if (!config.hfApiKey && !config.replicateApiKey) {
    console.warn('No API keys configured for free video generation');
    return null;
  }
  
  // Try ModelScope on Hugging Face
  if (config.hfApiKey) {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/damo-vilab/modelscope-damo-text-to-video-synthesis',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.hfApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_frames: 16,
              height: 256,
              width: 256,
            }
          }),
        }
      );
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('ModelScope video generation failed:', error);
    }
  }
  
  // Try ZeroScope on Hugging Face
  if (config.hfApiKey) {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/cerspense/zeroscope_v2_576w',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.hfApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_frames: 24,
              height: 320,
              width: 576,
            }
          }),
        }
      );
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('ZeroScope video generation failed:', error);
    }
  }
  
  // Try Replicate for Stable Video Diffusion
  if (config.replicateApiKey && imageUrls.length > 0) {
    // Would need an initial image first
  }
  
  return null;
}

// Generate placeholder images using Unsplash or generated URLs
function generatePlaceholderImage(prompt: string, productName: string): string {
  // Use relevant Unsplash images based on product category
  const categories = {
    'electronics': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=576&h=1024&q=80',
    'beauty': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=576&h=1024&q=80',
    'home': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=576&h=1024&q=80',
    'fashion': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=576&h=1024&q=80',
    'default': 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=576&h=1024&q=80'
  };
  
  // Simple keyword matching
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('earphone') || lowerPrompt.includes('headphone') || lowerPrompt.includes('bluetooth') || lowerPrompt.includes('tech') || lowerPrompt.includes('gadget')) {
    return categories.electronics;
  }
  if (lowerPrompt.includes('serum') || lowerPrompt.includes('skincare') || lowerPrompt.includes('beauty') || lowerPrompt.includes('skin')) {
    return categories.beauty;
  }
  if (lowerPrompt.includes('kitchen') || lowerPrompt.includes('home') || lowerPrompt.includes('appliance') || lowerPrompt.includes('cook')) {
    return categories.home;
  }
  if (lowerPrompt.includes('clothing') || lowerPrompt.includes('fashion') || lowerPrompt.includes('wear')) {
    return categories.fashion;
  }
  
  return categories.default;
}

// Enhanced video generation pipeline using free AI
export class FreeAIVideoPipeline {
  private config: FreeAIVideoConfig;
  
  constructor(config: FreeAIVideoConfig) {
    this.config = config;
  }
  
  async generateCompleteVideo(project: VideoProject): Promise<Blob | null> {
    // Step 1: Generate images for all scenes
    console.log('Generating scene images...');
    const sceneImages = await generateSceneImages(project, this.config);
    
    // Step 2: Optionally enhance with image-to-video for each scene
    // This would create short video clips for each scene
    
    // Step 3: Use existing canvas renderer to composite final video
    // This is already implemented in videoRecorder.ts
    
    // For now, return null to indicate we should use the existing renderer
    // The existing canvasRenderer + videoRecorder pipeline is actually better
    // for creating the styled TikTok/Reels videos with subtitles, stickers, etc.
    return null;
  }
  
  // Generate AI-powered script using free LLMs
  async generateScriptWithFreeLLM(params: any): Promise<any> {
    // Could integrate with:
    // - Hugging Face Inference API for LLMs (Llama, Mistral, etc.)
    // - Groq API (free tier for Llama 3)
    // - Together AI (free credits)
    // - Local transformers.js models
    
    // For now, fall back to the existing smart template system
    return null;
  }
}

export const freeAIVideoPipeline = new FreeAIVideoPipeline({});