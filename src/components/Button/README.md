# Sistema de Botões Padronizado

Este documento descreve o sistema de botões padronizado implementado para garantir consistência visual e semântica em toda a aplicação.

## Componente Button

O componente `Button` substitui todos os botões antigos (`LoadingButton`, botões nativos) para garantir consistência.

### Importação

```jsx
import Button from '../../components/Button';
import { MdSave, MdCancel, MdAdd } from 'react-icons/md';
```

### Props Disponíveis

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | string | 'primary' | Estilo do botão: 'primary', 'secondary', 'success', 'danger', 'outline', 'ghost' |
| `size` | string | 'medium' | Tamanho: 'small', 'medium', 'large' |
| `loading` | boolean | false | Estado de carregamento |
| `loadingText` | string | 'Carregando...' | Texto exibido durante carregamento |
| `disabled` | boolean | false | Desabilita o botão |
| `icon` | ReactNode | null | Ícone do botão |
| `onClick` | function | - | Função executada no clique |
| `type` | string | 'button' | Tipo do botão: 'button', 'submit', 'reset' |
| `ariaLabel` | string | - | Label para acessibilidade |
| `children` | ReactNode | - | Conteúdo do botão |

## Padrões de Uso

### Ações Principais (Primary)

```jsx
// Criar, Salvar, Confirmar
<Button 
  variant="primary" 
  size="medium" 
  icon={<MdSave />}
  type="submit"
>
  Salvar
</Button>
```

### Ações Secundárias (Secondary)

```jsx
// Cancelar, Voltar
<Button 
  variant="secondary" 
  size="medium" 
  icon={<MdCancel />}
  onClick={handleCancel}
>
  Cancelar
</Button>
```

### Ações de Sucesso (Success)

```jsx
// Confirmar, Aprovar
<Button 
  variant="success" 
  size="medium" 
  icon={<MdCheck />}
  onClick={handleConfirm}
>
  Confirmar
</Button>
```

### Ações Perigosas (Danger)

```jsx
// Excluir, Remover
<Button 
  variant="danger" 
  size="small" 
  icon={<MdDelete />}
  onClick={handleDelete}
>
  Excluir
</Button>
```

### Botões com Estado de Carregamento

```jsx
<Button 
  variant="primary" 
  size="large" 
  loading={isSubmitting}
  loadingText="Enviando..."
  type="submit"
  icon={<MdSend />}
>
  Enviar
</Button>
```

## Mapeamento de Ações

### Ações Comuns e suas Variantes

| Ação | Variante | Ícone Sugerido | Tamanho |
|------|----------|----------------|----------|
| Postar/Criar | primary | MdAdd, MdCreate | medium/large |
| Salvar | success | MdSave | medium |
| Cancelar | secondary | MdCancel | medium |
| Excluir | danger | MdDelete | small |
| Editar | outline | MdEdit | small |
| Confirmar | success | MdCheck | medium |
| Buscar | primary | MdSearch | medium |
| Voltar | secondary | MdArrowBack | medium |
| Login | primary | MdLogin | large |
| Cadastrar | primary | MdPersonAdd | large |

## Acessibilidade

- Sempre use `ariaLabel` para botões com apenas ícones
- Use `type="submit"` para botões de formulário
- O componente já inclui suporte para modo de alto contraste
- Estados de loading são anunciados para leitores de tela

## Responsividade

- Botões se adaptam automaticamente em telas menores
- Ícones podem ser ocultados em dispositivos muito pequenos
- Texto é ajustado para melhor legibilidade

## Migração de Componentes Antigos

### De LoadingButton para Button

```jsx
// Antes
<LoadingButton 
  loading={loading}
  loadingText="Salvando..."
  className={styles.saveButton}
>
  Salvar
</LoadingButton>

// Depois
<Button 
  loading={loading}
  loadingText="Salvando..."
  variant="success"
  size="medium"
  icon={<MdSave />}
>
  Salvar
</Button>
```

### De botão nativo para Button

```jsx
// Antes
<button 
  onClick={handleCancel}
  className={styles.cancelButton}
>
  Cancelar
</button>

// Depois
<Button 
  onClick={handleCancel}
  variant="secondary"
  size="medium"
  icon={<MdCancel />}
>
  Cancelar
</Button>
```

## Temas e Personalização

O componente suporta:
- Modo escuro/claro automático
- Alto contraste
- Variáveis CSS customizáveis
- Animações suaves

## Componentes Atualizados

Os seguintes componentes já foram migrados para o novo sistema:

- ✅ Modal.jsx
- ✅ CreatePostCard.jsx
- ✅ CommentForm.jsx
- ✅ CommentList.jsx
- ✅ CreatePost.jsx
- ✅ Agendamento.jsx
- ✅ Login.jsx
- ✅ Register.jsx
- ✅ RecuperarSenha.jsx
- ✅ CadastroEvento.jsx

## Próximos Passos

Para manter a consistência, sempre use o componente `Button` para novos desenvolvimentos e migre gradualmente os componentes restantes.