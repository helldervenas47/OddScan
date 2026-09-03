import cron from 'node-cron';
import { SyncOddsService } from './services/syncOddsService.js';

const intervalExpression = process.env.WORKER_INTERVAL_CRON || '*/15 * * * *';

console.log(`[OddScan Worker] Agendador iniciado com expressão: '${intervalExpression}'`);
console.log(`[OddScan Worker] Executando primeira coleta imediatamente...`);

const service = new SyncOddsService();

// Executa na inicialização
service.run().catch(err => {
  console.error('[OddScan Worker] Erro no ciclo inicial:', err);
});

// Agenda as próximas execuções
cron.schedule(intervalExpression, async () => {
  console.log(`[OddScan Worker] Disparando ciclo agendado (${new Date().toLocaleTimeString('pt-BR')})...`);
  try {
    await service.run();
  } catch (err) {
    console.error('[OddScan Worker] Falha no ciclo agendado:', err);
  }
});
