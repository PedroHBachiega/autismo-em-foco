# Cloud Functions para Registro de Logs de Atividades

Este módulo contém funções do Firebase Cloud Functions para registrar logs de atividades críticas no Firestore.

## Funções Implementadas

### Logs de Agendamentos

- **logScheduleActivity**: Registra a criação de novos agendamentos
- **logScheduleDeleteActivity**: Registra o cancelamento de agendamentos
- **logScheduleUpdateActivity**: Registra atualizações de status em agendamentos

### Logs de Posts na Comunidade

- **logPostActivity**: Registra a criação de novos posts
- **logPostDeleteActivity**: Registra a exclusão de posts

## Estrutura dos Logs

Os logs são armazenados na coleção `activity_logs` com a seguinte estrutura:

```javascript
{
  userId: string,       // ID do usuário que realizou a ação
  action: string,       // Tipo de ação (create, update, delete)
  collection: string,   // Coleção onde a ação foi realizada
  documentId: string,   // ID do documento afetado
  data: object,         // Dados relacionados à ação
  timestamp: timestamp  // Data e hora da ação (servidor)
}
```

## Implantação

Para implantar as funções, execute:

```bash
firebase deploy --only functions
```

## Visualização de Logs

Para visualizar os logs das funções em execução:

```bash
firebase functions:log
```