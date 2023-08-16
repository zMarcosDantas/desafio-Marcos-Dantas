class CaixaDaLanchonete {

    constructor() {
        this.controller = {
            'metodosDePagamento': {
                'dinheiro': {
                    'desconto': 0.95, // 5% de desconto
                    'taxa': 0
                },
                'debito': { // não possui taxa nem desconto
                    'desconto': 0, 
                    'taxa': 0
                },
                'credito': {
                    'desconto': 0, 
                    'taxa': 1.03 // 3% de acrescimo
                }
            },
            'produtos': {
                "cafe": {
                    "valor": 3
                },
                "chantily": {
                    "valor": 1.5,
                    "extra": "cafe" // extra de chantily so pode ser exclusivamente cafe
                },
                "suco": {
                    "valor": 6.20
                },
                "sanduiche": {
                    "valor": 6.50
                },
                "queijo": {
                    "valor": 2,
                    "extra": "sanduiche" // extra de chantily so pode ser exclusivamente sanduiche
                },
                "salgado": {
                    "valor": 7.25
                },
                "combo1": {
                    "valor": 9.50,
                },
                "combo2": {
                    "valor": 7.50,
                }
            }
        };

        this.metodosChaves = Object.keys(this.controller.metodosDePagamento);
        this.produtosChaves = Object.keys(this.controller.produtos);
        this.metodos = this.controller.metodosDePagamento;
        this.produtos = this.controller.produtos; 
    }


    calcularValorDaCompra(metodoDePagamento, itens) {

        let carrinhoComItem = this.verificarSeCarrinhoDeComprasEstaVazio(itens);
        if(!carrinhoComItem) return 'Não há itens no carrinho de compra!';

        let metodoPagamentoValido = this.verificarFormaDePagamento(metodoDePagamento);
        if(!metodoPagamentoValido) return 'Forma de pagamento inválida!';

        let itensSemQuantidades = itens.map(item => item.split(',')[0]);

        let valor = 0; 

        for(let i = 0; i < itens.length; i++) {
                let elemento = itens[i];
                let el = elemento.split(',');
                let item = el[0];
                let quantidade = Number(el[1]);

                let itemExiste = this.verificarExistenciaProduto(item);
                if(!itemExiste) return 'Item inválido!';

                let quantidadeValida = this.verificarQuantidadeProduto(quantidade);
                if(!quantidadeValida) return 'Quantidade inválida!';

                let extrasValidos = this.verificarExtras(item, itensSemQuantidades);
                if(!extrasValidos) return 'Item extra não pode ser pedido sem o principal';

                let valorProduto = this.pegarValorItem(item, quantidade);

                valor += valorProduto;
        }
        
        let valorFinal = (valor * this.pegarDescontoOuTaxa(metodoDePagamento)).toFixed(2);

        return 'R$ ' + this.converterValorFinalString(valorFinal);
    }

    converterValorFinalString(valor) {
        return String(valor).replaceAll('.', ',');
    }

    pegarDescontoOuTaxa(metodoDePagamento) {
        let descontoOuTaxa = Math.abs(this.metodos[metodoDePagamento].taxa - this.metodos[metodoDePagamento].desconto); // subtrai taxas de descontos, possibilitando alteração nas taxas e descontos
        return descontoOuTaxa ? descontoOuTaxa : 1; // caso n exista taxa (0), retorna 1;
    }

    pegarValorItem(item, quantidade) {
        return this.produtos[item].valor * quantidade; // pega o valor do item e multiplica pela quantidade
    }

    verificarExtras(item, itens) {
        let produtoExtra = this.produtos[item].extra;
        if(produtoExtra && !itens.includes(produtoExtra)) return false; // caso o item seja um produtoextra e na lista de pedidos nao tenha o pedido principal retorne false;
        return true; 
    }

    verificarQuantidadeProduto(quantidade) {
        return (quantidade > 0) ? true : false; // caso a lista de produtos seja > 0 retorne true; 
    }

    verificarExistenciaProduto(nomeProduto) {
        return this.produtosChaves.includes(nomeProduto); // verifica se o produto existe na array de produtos;
    }

    verificarFormaDePagamento(metodoDePagamento) {
        let metodos = this.metodosChaves;
        return metodos.includes(metodoDePagamento); // verifica se o metodo existe na array de produtos;
    }

    verificarSeCarrinhoDeComprasEstaVazio(itens) {
        return (itens.length > 0); // se o carrinho tiver itens, então retorna true por não estar vazio.
    }

}

export { CaixaDaLanchonete };
