export class ConfiguracaoSeguranca {
  ExigirSenhaExcluirVeiculoPatio: boolean = true
  ExigirSenhaEditarServicosVeiculo: boolean = true
  ExigirSenhaPagarDepois: boolean = true
  ExigirSenhaAlterarResponsavel: boolean = true
  ExigirSenhaConcederDesconto: boolean = true
  ExigirSenhaRelatoriosGerenciais: boolean = true
  ExigirSenhaCadastroFuncionarios: boolean = true
  ExigirSenhaCadastroServicos: boolean = true
  ExigirSenhaCadastroMensalistas: boolean = true
  ExigirSenhaCadastroProdutos: boolean = true
  EmailAdministrador: string = ''
  SenhaAdministrador
  CodigoRecuperacao

  constructor(configuracaoSeguranca: ConfiguracaoSeguranca = null) {
    if (configuracaoSeguranca != null) {
      this.ExigirSenhaExcluirVeiculoPatio = configuracaoSeguranca.ExigirSenhaExcluirVeiculoPatio
      this.ExigirSenhaEditarServicosVeiculo = configuracaoSeguranca.ExigirSenhaEditarServicosVeiculo
      this.ExigirSenhaPagarDepois = configuracaoSeguranca.ExigirSenhaPagarDepois
      this.ExigirSenhaAlterarResponsavel = configuracaoSeguranca.ExigirSenhaAlterarResponsavel
      this.ExigirSenhaConcederDesconto = configuracaoSeguranca.ExigirSenhaConcederDesconto
      this.ExigirSenhaRelatoriosGerenciais = configuracaoSeguranca.ExigirSenhaRelatoriosGerenciais
      this.ExigirSenhaCadastroFuncionarios = configuracaoSeguranca.ExigirSenhaCadastroFuncionarios
      this.ExigirSenhaCadastroServicos = configuracaoSeguranca.ExigirSenhaCadastroServicos
      this.ExigirSenhaCadastroMensalistas = configuracaoSeguranca.ExigirSenhaCadastroMensalistas
      this.ExigirSenhaCadastroProdutos = configuracaoSeguranca.ExigirSenhaCadastroProdutos
      this.EmailAdministrador = configuracaoSeguranca.EmailAdministrador
      this.SenhaAdministrador = configuracaoSeguranca.SenhaAdministrador
      this.CodigoRecuperacao = configuracaoSeguranca.CodigoRecuperacao
    }
  }
}
