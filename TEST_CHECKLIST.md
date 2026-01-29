# Checklist de Teste - Sistema de Pedidos Unificado

## Testes Obrigatórios

### 1. Teste de Criação de Pedido
- [ ] Acessar `/forms` e preencher formulário completo
- [ ] Verificar que pedido é salvo corretamente no Firestore
- [ ] Confirmar mensagem de sucesso após envio

### 2. Teste do Comprovante Cliente
- [ ] Após criar pedido, verificar dados exibidos no comprovante
- [ ] Confirmar que todos os campos preenchidos aparecem
- [ ] Validar formatação e apresentação dos dados

### 3. Teste da Área DEV
- [ ] Acessar `/dev` com credenciais corretas
- [ ] Navegar até a aba "Pedidos"
- [ ] Verificar que o pedido criado aparece na lista

### 4. Comparação Cliente vs DEV
- [ ] Comparar campos exibidos no comprovante cliente
- [ ] Comparar campos exibidos no comprovante DEV
- [ ] Confirmar que ambos mostram as mesmas informações

### 5. Teste de Campos Opcionais
- [ ] Criar pedido sem telefone (campo opcional)
- [ ] Criar pedido sem orçamento (campo opcional)
- [ ] Verificar que placeholders "—" aparecem corretamente

### 6. Teste de Performance e Erros
- [ ] Verificar que não há crashes com createdAt null
- [ ] Testar com pedidos antigos (sem alguns campos)
- [ ] Confirmar carregamento adequado da lista de pedidos

## Campos que DEVEM estar presentes em ambos os comprovantes:

✅ ID do Pedido
✅ Data/Hora de criação
✅ Status do pedido
✅ Nome do cliente
✅ Email do cliente
✅ Telefone (se fornecido)
✅ Título/Serviço solicitado
✅ Categoria
✅ Descrição detalhada
✅ Orçamento (se fornecido)
✅ Prazo desejado (se fornecido)
✅ Complexidade do projeto
✅ Lista de requisitos/features
✅ Método de contato preferido

## Fonte de Dados:
Ambos os comprovantes DEVEM usar a mesma fonte: collection('orders') no Firestore