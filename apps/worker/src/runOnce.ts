import { SyncOddsService } from './services/syncOddsService.js';

async function main() {
  const service = new SyncOddsService();
  try {
    const report = await service.run();
    console.log('[OddScan] Execução pontual concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('[OddScan] Erro fatal durante a execução do worker:', error);
    process.exit(1);
  }
}

main();
