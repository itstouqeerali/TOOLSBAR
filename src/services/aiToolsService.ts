import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AiTool } from '../types/aiTools';
import { AI_TOOLS_SEED } from '../data/aiToolsData';

const COLLECTION_NAME = 'aiTools';

// In-memory cache to ensure instant client rendering
let memoryToolsCache: AiTool[] | null = null;

export async function fetchAllAiTools(includeDrafts = false): Promise<AiTool[]> {
  try {
    // Attempt Firestore fetch
    const aiToolsCol = collection(db, COLLECTION_NAME);
    const q = includeDrafts ? query(aiToolsCol) : query(aiToolsCol, where('isPublished', '==', true));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const firestoreTools: AiTool[] = [];
      snapshot.forEach((docSnap) => {
        firestoreTools.push(docSnap.data() as AiTool);
      });

      // Merge firestore tools with seed tools (Firestore overrides seed on matching slug/id)
      const mergedMap = new Map<string, AiTool>();
      
      // Add seed tools first
      AI_TOOLS_SEED.forEach((seed) => {
        if (includeDrafts || seed.isPublished) {
          mergedMap.set(seed.slug, seed);
        }
      });

      // Overlay Firestore tools
      firestoreTools.forEach((fTool) => {
        mergedMap.set(fTool.slug, fTool);
      });

      const combined = Array.from(mergedMap.values());
      memoryToolsCache = combined;
      return combined;
    }
  } catch (err) {
    console.warn('Firestore aiTools read warning, falling back to verified seed:', err);
  }

  // Fallback to local verified seed
  const fallback = includeDrafts 
    ? [...AI_TOOLS_SEED] 
    : AI_TOOLS_SEED.filter((t) => t.isPublished);
  memoryToolsCache = fallback;
  return fallback;
}

export function getCachedAiTools(includeDrafts = false): AiTool[] {
  if (memoryToolsCache) {
    return includeDrafts ? memoryToolsCache : memoryToolsCache.filter((t) => t.isPublished);
  }
  return includeDrafts ? AI_TOOLS_SEED : AI_TOOLS_SEED.filter((t) => t.isPublished);
}

export async function getAiToolBySlugLive(slug: string, includeDrafts = false): Promise<AiTool | undefined> {
  const tools = await fetchAllAiTools(includeDrafts);
  return tools.find((t) => t.slug === slug || t.id === slug);
}

export async function saveAiToolToFirestore(tool: AiTool): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, tool.id);
  await setDoc(docRef, { ...tool }, { merge: true });
  
  // Update in-memory cache
  if (memoryToolsCache) {
    const idx = memoryToolsCache.findIndex((t) => t.id === tool.id || t.slug === tool.slug);
    if (idx >= 0) {
      memoryToolsCache[idx] = tool;
    } else {
      memoryToolsCache.push(tool);
    }
  }
}

export async function deleteAiToolFromFirestore(toolId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, toolId);
  await deleteDoc(docRef);

  if (memoryToolsCache) {
    memoryToolsCache = memoryToolsCache.filter((t) => t.id !== toolId);
  }
}
