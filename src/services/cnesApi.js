const BASE_URL = 'https://cnes.herokuapp.com/api/cnes';

/**
 * Serviço para consultar a API CNES (Cadastro Nacional de Estabelecimentos de Saúde)
 * Utiliza uma API não-oficial que disponibiliza dados do CNES
 */
export const cnesApi = {
  /**
   * Busca estabelecimentos de saúde com base nos filtros
   * @param {Object} filters - Filtros para a busca
   * @param {string} filters.name - Nome do estabelecimento (opcional)
   * @param {string} filters.city - Cidade do estabelecimento
   * @param {Array} filters.healthUnities - Tipos de unidades de saúde
   * @returns {Promise<Array>} Lista de estabelecimentos
   */
  async getEstablishments(filters = {}) {
    try {
      // Construir a URL com os parâmetros de busca
      let url = `${BASE_URL}/establishments/?`;
      
      // Adicionar filtro por nome se fornecido
      if (filters.name) {
        url += `name=${encodeURIComponent(filters.name)}&`;
      }
      
      // Adicionar filtro por cidade se fornecido
      if (filters.city) {
        url += `city=${encodeURIComponent(filters.city)}&`;
      }
      
      // Adicionar filtros por tipo de unidade de saúde
      if (filters.healthUnities && filters.healthUnities.length > 0) {
        filters.healthUnities.forEach(unity => {
          url += `health_unities[]=${unity}&`;
        });
      }
      
      // Remover o último '&' da URL
      url = url.slice(0, -1);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar estabelecimentos: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar estabelecimentos:', error);
      // Em caso de falha na API, retornar array vazio
      return [];
    }
  },
  
  /**
   * Busca os tipos de unidades de saúde disponíveis
   * @returns {Promise<Array>} Lista de tipos de unidades
   */
  async getHealthUnities() {
    try {
      const response = await fetch(`${BASE_URL}/health_unities`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos de unidades: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar tipos de unidades:', error);
      return [];
    }
  },
  
  /**
   * Função de fallback que retorna dados simulados caso a API esteja indisponível
   * @param {string} city - Cidade para filtrar
   * @param {string} specialty - Especialidade para filtrar
   * @returns {Array} Lista de estabelecimentos simulados
   */
  getMockEstablishments(city, specialty) {
    // Dados simulados para caso a API esteja indisponível
    const mockData = [
      {
        id: 1,
        nome: "Clínica Especializada em TEA",
        especialidade: "Clínica Multidisciplinar",
        endereco: "Av. Principal, 1000",
        cidade: "São Paulo",
        telefone: "(11) 3456-7890",
        avaliacao: 4.9,
        imagem: "https://placehold.co/600x400/2361ad/FFF?text=Clínica",
        horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
      },
      {
        id: 2,
        nome: "Centro de Atendimento Especializado",
        especialidade: "Neuropsicologia",
        endereco: "Rua das Flores, 500",
        cidade: "São Paulo",
        telefone: "(11) 2345-6789",
        avaliacao: 4.8,
        imagem: "https://placehold.co/600x400/2361ad/FFF?text=Centro",
        horarios: ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"]
      },
      {
        id: 3,
        nome: "Instituto de Desenvolvimento Infantil",
        especialidade: "Terapia Ocupacional",
        endereco: "Av. Secundária, 200",
        cidade: "São Paulo",
        telefone: "(11) 3333-4444",
        avaliacao: 4.7,
        imagem: "https://placehold.co/600x400/2361ad/FFF?text=Instituto",
        horarios: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
      }
    ];
    
    // Filtrar por cidade se fornecida
    let filtered = mockData;
    if (city) {
      filtered = filtered.filter(item => 
        item.cidade.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    // Filtrar por especialidade se fornecida
    if (specialty) {
      filtered = filtered.filter(item => 
        item.especialidade.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    
    return filtered;
  }
};