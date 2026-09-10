import fs from 'fs/promises';
import path from 'path';

// process.cwd() no Next.js sempre aponta para a raiz do projeto.
// Definimos tambem um fallback absoluto para garantir.
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
const dataFilePath = path.join(PROJECT_ROOT, 'data.json');

export async function getDbData() {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    
    // Migração em tempo de execução para bancos de dados antigos
    if (!data.routines) {
      data.routines = [];
      await saveDbData(data);
    }
    
    return data;
  } catch {
    return { tasks: [], notes: [], snippets: [], routines: [] };
  }
}

export async function saveDbData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
