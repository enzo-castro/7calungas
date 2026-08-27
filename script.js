/* =========================================================
   7CALUNGAS
   SCRIPT ÚNICO
   Carrinho + Frete + Produtos + Pedidos + Checkout
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const CEP_ORIGEM = "20771000";

const FRETE_MINIMO = 3;

const PRECO_POR_KM = 0.35;

const CHAVE_CARRINHO = "carrinho7calungas";


/* =========================================================
   CARRINHO
========================================================= */

let carrinho = JSON.parse(
    localStorage.getItem(CHAVE_CARRINHO)
) || [];


/* Frete atual */

let freteAtual =
    parseFloat(
        localStorage.getItem("frete7calungas")
    ) || 0;


/* =========================================================
   SALVAR CARRINHO
========================================================= */

function salvarCarrinho() {

    localStorage.setItem(
        CHAVE_CARRINHO,
        JSON.stringify(carrinho)
    );

}


/* =========================================================
   SALVAR FRETE
========================================================= */

function salvarFrete() {

    localStorage.setItem(
        "frete7calungas",
        freteAtual.toString()
    );

}


/* =========================================================
   FORMATAR PREÇO
========================================================= */

function formatarPreco(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   ABRIR CARRINHO
========================================================= */

function abrirCarrinho() {

    const carrinhoLateral =
        document.getElementById("carrinhoLateral");

    const overlay =
        document.getElementById("overlayCarrinho");

    if (!carrinhoLateral || !overlay) {

        return;

    }

    carrinhoLateral.classList.add("active");

    overlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   FECHAR CARRINHO
========================================================= */

function fecharCarrinho() {

    const carrinhoLateral =
        document.getElementById("carrinhoLateral");

    const overlay =
        document.getElementById("overlayCarrinho");

    if (carrinhoLateral) {

        carrinhoLateral.classList.remove("active");

    }

    if (overlay) {

        overlay.classList.remove("active");

    }

    document.body.style.overflow = "";

}


/* =========================================================
   ADICIONAR AO CARRINHO
========================================================= */

function adicionarAoCarrinho(produto) {

    if (!produto || !produto.id) {

        console.error(
            "Produto inválido:",
            produto
        );

        return;

    }


    const existente =
        carrinho.find(
            item =>
                String(item.id) ===
                String(produto.id)
        );


    if (existente) {

        existente.quantidade++;

    } else {

        carrinho.push({

            ...produto,

            preco:
                Number(produto.preco),

            quantidade: 1

        });

    }


    salvarCarrinho();

    atualizarCarrinho();

    abrirCarrinho();

}


/* =========================================================
   REMOVER PRODUTO
========================================================= */

function removerDoCarrinho(id) {

    carrinho =
        carrinho.filter(
            produto =>
                String(produto.id) !==
                String(id)
        );


    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   ALTERAR QUANTIDADE
========================================================= */

function alterarQuantidade(id, valor) {

    const produto =
        carrinho.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!produto) {

        return;

    }


    produto.quantidade += valor;


    if (produto.quantidade <= 0) {

        removerDoCarrinho(id);

        return;

    }


    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   SUBTOTAL
========================================================= */

function calcularSubtotal() {

    return carrinho.reduce(
        (total, produto) => {

            return total +
                Number(produto.preco || 0) *
                Number(produto.quantidade || 0);

        },
        0
    );

}


/* =========================================================
   QUANTIDADE TOTAL
========================================================= */

function calcularQuantidadeProdutos() {

    return carrinho.reduce(
        (total, produto) => {

            return total +
                Number(produto.quantidade || 0);

        },
        0
    );

}


/* =========================================================
   ATUALIZAR CARRINHO
========================================================= */

function atualizarCarrinho() {

    const lista =
        document.getElementById(
            "listaCarrinho"
        );

    const contador =
        document.getElementById(
            "contadorCarrinho"
        );

    const quantidadeTexto =
        document.getElementById(
            "quantidadeCarrinho"
        );

    const subtotalElemento =
        document.getElementById(
            "subtotalCarrinho"
        );

    const freteElemento =
        document.getElementById(
            "freteCarrinho"
        );

    const totalElemento =
        document.getElementById(
            "totalCarrinho"
        );


    const quantidade =
        calcularQuantidadeProdutos();


    /* =====================================================
       CONTADOR
    ===================================================== */

    if (contador) {

        contador.textContent =
            quantidade;

    }


    if (quantidadeTexto) {

        quantidadeTexto.textContent =
            quantidade === 1
                ? "1 produto"
                : `${quantidade} produtos`;

    }


    /* =====================================================
       LISTA
    ===================================================== */

    if (lista) {

        if (carrinho.length === 0) {

            lista.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h4>
                        Seu carrinho está vazio
                    </h4>

                    <p>
                        Adicione alguns produtos
                        para começar sua compra.
                    </p>

                </div>

            `;

        } else {

            lista.innerHTML =
                carrinho.map(produto => `

                    <div class="cart-item">

                        <img
                            src="${
                                produto.imagem ||
                                "https://via.placeholder.com/75"
                            }"
                            class="cart-item-image"
                            alt="${produto.nome}"
                        >

                        <div class="cart-item-info">

                            <div class="cart-item-title">
                                ${produto.nome}
                            </div>

                            <div class="cart-item-price">
                                ${formatarPreco(produto.preco)}
                            </div>

                            <div class="quantity-control">

                                <button
                                    type="button"
                                    onclick="alterarQuantidade(${JSON.stringify(produto.id)}, -1)"
                                >
                                    −
                                </button>

                                <span>
                                    ${produto.quantidade}
                                </span>

                                <button
                                    type="button"
                                    onclick="alterarQuantidade(${JSON.stringify(produto.id)}, 1)"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        <button
                            class="remove-product"
                            type="button"
                            onclick="removerDoCarrinho(${JSON.stringify(produto.id)})"
                            title="Remover"
                        >
                            🗑️
                        </button>

                    </div>

                `).join("");

        }

    }


    /* =====================================================
       VALORES
    ===================================================== */

    const subtotal =
        calcularSubtotal();

    const total =
        subtotal + freteAtual;


    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatarPreco(subtotal);

    }


    if (freteElemento) {

        freteElemento.textContent =
            formatarPreco(freteAtual);

    }


    if (totalElemento) {

        totalElemento.textContent =
            formatarPreco(total);

    }

}


/* =========================================================
   BUSCAR CEP
========================================================= */

async function buscarCEP(cep) {

    cep =
        String(cep || "")
            .replace(/\D/g, "");


    if (cep.length !== 8) {

        throw new Error(
            "Digite um CEP válido."
        );

    }


    const resposta =
        await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao consultar o CEP."
        );

    }


    const dados =
        await resposta.json();


    if (dados.erro) {

        throw new Error(
            "CEP não encontrado."
        );

    }


    return dados;

}


/* =========================================================
   COORDENADAS
========================================================= */

async function buscarCoordenadas(endereco) {

    const enderecoCompleto =
        [
            endereco.logradouro,
            endereco.bairro,
            endereco.localidade,
            endereco.uf,
            "Brasil"
        ]
            .filter(Boolean)
            .join(", ");


    const url =
        "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({

            q: enderecoCompleto,

            format: "json",

            limit: "1",

            countrycodes: "br"

        });


    const resposta =
        await fetch(url);


    if (!resposta.ok) {

        throw new Error(
            "Erro ao localizar endereço."
        );

    }


    const dados =
        await resposta.json();


    if (!dados.length) {

        throw new Error(
            "Não foi possível localizar o endereço."
        );

    }


    return {

        latitude:
            parseFloat(dados[0].lat),

        longitude:
            parseFloat(dados[0].lon)

    };

}


/* =========================================================
   DISTÂNCIA
========================================================= */

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const raio = 6371;


    const latitude1 =
        lat1 * Math.PI / 180;


    const latitude2 =
        lat2 * Math.PI / 180;


    const diferencaLatitude =
        (lat2 - lat1) *
        Math.PI / 180;


    const diferencaLongitude =
        (lon2 - lon1) *
        Math.PI / 180;


    const a =
        Math.sin(
            diferencaLatitude / 2
        ) ** 2 +

        Math.cos(latitude1) *

        Math.cos(latitude2) *

        Math.sin(
            diferencaLongitude / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return raio * c;

}


/* =========================================================
   CALCULAR FRETE
========================================================= */

async function calcularFrete(cepDestino) {

    const origem =
        await buscarCEP(
            CEP_ORIGEM
        );


    const destino =
        await buscarCEP(
            cepDestino
        );


    const coordenadasOrigem =
        await buscarCoordenadas(
            origem
        );


    const coordenadasDestino =
        await buscarCoordenadas(
            destino
        );


    const distancia =
        calcularDistancia(

            coordenadasOrigem.latitude,

            coordenadasOrigem.longitude,

            coordenadasDestino.latitude,

            coordenadasDestino.longitude

        );


    let preco =
        distancia *
        PRECO_POR_KM;


    if (preco < FRETE_MINIMO) {

        preco =
            FRETE_MINIMO;

    }


    return {

        distancia,

        preco,

        origem,

        destino

    };

}


/* =========================================================
   EXECUTAR CÁLCULO DO FRETE
========================================================= */

async function executarCalculoFrete() {

    const campo =
        document.getElementById(
            "cepDestino"
        );

    const resultado =
        document.getElementById(
            "resultadoFrete"
        );


    if (!campo || !resultado) {

        return;

    }


    resultado.innerHTML =
        "Calculando... ⏳";


    try {

        const frete =
            await calcularFrete(
                campo.value
            );


        freteAtual =
            frete.preco;


        salvarFrete();


        resultado.innerHTML = `

            <div class="frete-sucesso">

                📍
                ${frete.destino.localidade}
                -
                ${frete.destino.uf}

                <br>

                Distância aproximada:
                ${frete.distancia.toFixed(1)} km

                <br>

                Frete:
                <strong>
                    ${formatarPreco(frete.preco)}
                </strong>

            </div>

        `;


        atualizarCarrinho();

    } catch (erro) {

        freteAtual = 0;

        salvarFrete();


        resultado.innerHTML = `

            <div class="frete-erro">

                ❌ ${erro.message}

            </div>

        `;


        atualizarCarrinho();

    }

}


/* =========================================================
   FINALIZAR COMPRA
========================================================= */

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio! 🛒"
        );

        return;

    }


    window.location.href =
        "checkout.html";

}


/* =========================================================
   CHECKOUT
========================================================= */


/* =========================================================
   CARREGAR CHECKOUT
========================================================= */

function carregarCheckout() {

    const lista =
        document.getElementById(
            "checkoutProdutos"
        );


    if (!lista) {

        return;

    }


    const quantidade =
        calcularQuantidadeProdutos();


    const subtotal =
        calcularSubtotal();


    const total =
        subtotal + freteAtual;


    /* =====================================================
       QUANTIDADE
    ===================================================== */

    const quantidadeElemento =
        document.getElementById(
            "checkoutQuantidade"
        );


    if (quantidadeElemento) {

        quantidadeElemento.textContent =
            quantidade === 1
                ? "1 produto"
                : `${quantidade} produtos`;

    }


    /* =====================================================
       CARRINHO VAZIO
    ===================================================== */

    if (carrinho.length === 0) {

        lista.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h4>
                    Seu carrinho está vazio
                </h4>

                <p>
                    Adicione produtos antes
                    de finalizar a compra.
                </p>

            </div>

        `;


        const botao =
            document.querySelector(
                ".confirm-payment-button"
            );


        if (botao) {

            botao.disabled = true;

            botao.style.opacity = "0.5";

        }

    } else {

        lista.innerHTML =
            carrinho.map(produto => {

                const totalProduto =
                    Number(produto.preco) *
                    Number(produto.quantidade);


                return `

                    <div class="checkout-product">

                        <img
                            src="${
                                produto.imagem ||
                                "https://via.placeholder.com/75"
                            }"
                            class="checkout-product-image"
                            alt="${produto.nome}"
                        >

                        <div class="checkout-product-info">

                            <div class="checkout-product-name">
                                ${produto.nome}
                            </div>

                            <div class="checkout-product-quantity">
                                Quantidade:
                                ${produto.quantidade}
                            </div>

                        </div>

                        <div class="checkout-product-price">
                            ${formatarPreco(totalProduto)}
                        </div>

                    </div>

                `;

            }).join("");

    }


    /* =====================================================
       VALORES
    ===================================================== */

    const subtotalElemento =
        document.getElementById(
            "checkoutSubtotal"
        );


    const freteElemento =
        document.getElementById(
            "checkoutFrete"
        );


    const totalElemento =
        document.getElementById(
            "checkoutTotal"
        );


    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatarPreco(subtotal);

    }


    if (freteElemento) {

        freteElemento.textContent =
            formatarPreco(freteAtual);

    }


    if (totalElemento) {

        totalElemento.textContent =
            formatarPreco(total);

    }

}


/* =========================================================
   SELECIONAR PAGAMENTO
========================================================= */

function selecionarPagamento(tipo) {

    const pix =
        document.getElementById(
            "pagamentoPix"
        );


    const cartao =
        document.getElementById(
            "pagamentoCartao"
        );


    if (!pix || !cartao) {

        return;

    }


    if (tipo === "pix") {

        pix.classList.remove("hidden");

        cartao.classList.add("hidden");

    }


    if (tipo === "cartao") {

        cartao.classList.remove("hidden");

        pix.classList.add("hidden");

    }

}


/* =========================================================
   BUSCAR ENDEREÇO NO CHECKOUT
========================================================= */

async function buscarEnderecoCheckout() {

    const campoCEP =
        document.getElementById(
            "checkoutCEP"
        );


    if (!campoCEP) {

        return;

    }


    const cep =
        campoCEP.value;


    try {

        const endereco =
            await buscarCEP(cep);


        const enderecoCampo =
            document.getElementById(
                "checkoutEndereco"
            );


        const bairroCampo =
            document.getElementById(
                "checkoutBairro"
            );


        const cidadeCampo =
            document.getElementById(
                "checkoutCidade"
            );


        if (enderecoCampo) {

            enderecoCampo.value =
                endereco.logradouro || "";

        }


        if (bairroCampo) {

            bairroCampo.value =
                endereco.bairro || "";

        }


        if (cidadeCampo) {

            cidadeCampo.value =
                `${endereco.localidade || ""} - ${endereco.uf || ""}`;

        }


        /* =================================================
           CALCULA O FRETE AUTOMATICAMENTE
        ================================================== */

        try {

            const frete =
                await calcularFrete(cep);


            freteAtual =
                frete.preco;


            salvarFrete();


            carregarCheckout();


        } catch (erroFrete) {

            console.warn(
                "Não foi possível calcular o frete:",
                erroFrete
            );

        }

    } catch (erro) {

        alert(
            erro.message
        );

    }

}


/* =========================================================
   VALIDAR DADOS DO CHECKOUT
========================================================= */

function validarCheckout() {

    const nome =
        document.getElementById(
            "checkoutNome"
        );


    const email =
        document.getElementById(
            "checkoutEmail"
        );


    const telefone =
        document.getElementById(
            "checkoutTelefone"
        );


    const cep =
        document.getElementById(
            "checkoutCEP"
        );


    const endereco =
        document.getElementById(
            "checkoutEndereco"
        );


    const numero =
        document.getElementById(
            "checkoutNumero"
        );


    const aceitar =
        document.getElementById(
            "aceitarTermos"
        );


    if (
        !nome ||
        !email ||
        !telefone ||
        !cep ||
        !endereco ||
        !numero
    ) {

        return false;

    }


    if (!nome.value.trim()) {

        alert(
            "Digite seu nome."
        );

        nome.focus();

        return false;

    }


    if (!email.value.trim()) {

        alert(
            "Digite seu e-mail."
        );

        email.focus();

        return false;

    }


    if (
        !email.value.includes("@") ||
        !email.value.includes(".")
    ) {

        alert(
            "Digite um e-mail válido."
        );

        email.focus();

        return false;

    }


    if (!telefone.value.trim()) {

        alert(
            "Digite seu telefone."
        );

        telefone.focus();

        return false;

    }


    if (
        cep.value
            .replace(/\D/g, "")
            .length !== 8
    ) {

        alert(
            "Digite um CEP válido."
        );

        cep.focus();

        return false;

    }


    if (!endereco.value.trim()) {

        alert(
            "Digite seu endereço."
        );

        endereco.focus();

        return false;

    }


    if (!numero.value.trim()) {

        alert(
            "Digite o número do endereço."
        );

        numero.focus();

        return false;

    }


    if (
        !aceitar ||
        !aceitar.checked
    ) {

        alert(
            "Confirme que os dados informados estão corretos."
        );

        return false;

    }


    return true;

}


/* =========================================================
   OBTER FORMA DE PAGAMENTO
========================================================= */

function obterFormaPagamento() {

    const selecionado =
        document.querySelector(
            'input[name="formaPagamento"]:checked'
        );


    if (!selecionado) {

        return null;

    }


    return selecionado.value;

}


/* =========================================================
   PROCESSAR PAGAMENTO
========================================================= */

function processarPagamento() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio! 🛒"
        );

        return;

    }


    if (!validarCheckout()) {

        return;

    }


    const pagamento =
        obterFormaPagamento();


    if (!pagamento) {

        alert(
            "Escolha uma forma de pagamento."
        );

        return;

    }


    const subtotal =
        calcularSubtotal();


    const total =
        subtotal + freteAtual;


    /* =====================================================
       PIX
    ===================================================== */

    if (pagamento === "pix") {

        mostrarResultadoPagamento(

            "pix",

            total

        );

        return;

    }


    /* =====================================================
       CARTÃO
    ===================================================== */

    if (pagamento === "cartao") {

        /*
         * IMPORTANTE:
         *
         * Não processamos cartão diretamente
         * neste JavaScript.
         *
         * O próximo passo será conectar um
         * gateway de pagamento seguro.
         */

        mostrarResultadoPagamento(

            "cartao",

            total

        );

    }

}


/* =========================================================
   MOSTRAR RESULTADO
========================================================= */

function mostrarResultadoPagamento(
    tipo,
    total
) {

    const overlay =
        document.getElementById(
            "resultadoPagamento"
        );


    const titulo =
        document.getElementById(
            "resultadoPagamentoTitulo"
        );


    const texto =
        document.getElementById(
            "resultadoPagamentoTexto"
        );


    const dados =
        document.getElementById(
            "dadosPagamento"
        );


    if (
        !overlay ||
        !titulo ||
        !texto ||
        !dados
    ) {

        return;

    }


    if (tipo === "pix") {

        titulo.textContent =
            "Pedido preparado! 🟢";


        texto.textContent =
            "O próximo passo será gerar a cobrança Pix através do gateway de pagamento.";


        dados.innerHTML = `

            <strong>
                Total do pedido
            </strong>

            <br>

            ${formatarPreco(total)}

            <br><br>

            <span>
                🔒 A cobrança Pix real será
                gerada quando o gateway de
                pagamento estiver conectado.
            </span>

        `;

    }


    if (tipo === "cartao") {

        titulo.textContent =
            "Checkout preparado! 💳";


        texto.textContent =
            "O pagamento com cartão será processado por um gateway seguro.";


        dados.innerHTML = `

            <strong>
                Total do pedido
            </strong>

            <br>

            ${formatarPreco(total)}

            <br><br>

            <span>
                🔒 Os dados do cartão não são
                armazenados pelo site.
            </span>

        `;

    }


    overlay.classList.add("active");

}


/* =========================================================
   VOLTAR PARA INÍCIO
========================================================= */

function voltarParaInicio() {

    window.location.href =
        "index.html";

}


/* =========================================================
   PESQUISA DE PRODUTOS
========================================================= */

function pesquisarProdutos() {

    const campo =
        document.getElementById(
            "campoPesquisa"
        );


    const produtos =
        document.querySelectorAll(
            ".produto-item"
        );


    if (!campo || !produtos.length) {

        return;

    }


    const pesquisa =
        campo.value
            .toLowerCase()
            .trim();


    produtos.forEach(produto => {

        const nome =
            (
                produto.dataset.nome ||
                produto.textContent
            ).toLowerCase();


        if (
            !pesquisa ||
            nome.includes(pesquisa)
        ) {

            produto.style.display = "";

        } else {

            produto.style.display = "none";

        }

    });

}


/* =========================================================
   PESQUISA AO DIGITAR ENTER
========================================================= */

function configurarPesquisa() {

    const campo =
        document.getElementById(
            "campoPesquisa"
        );


    if (!campo) {

        return;

    }


    campo.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                pesquisarProdutos();

            }

        }
    );

}


/* =========================================================
   PEDIDO PERSONALIZADO
========================================================= */

function abrirPedidoPersonalizado() {

    const modal =
        document.getElementById(
            "pedidoPersonalizado"
        );


    if (!modal) {

        /*
         * Se estiver em outra página,
         * encaminha para a página própria.
         */

        if (
            !window.location.pathname.endsWith(
                "pedidos.html"
            )
        ) {

            window.location.href =
                "pedidos.html";

        }

        return;

    }


    modal.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR PEDIDO PERSONALIZADO
========================================================= */

function fecharPedidoPersonalizado() {

    const modal =
        document.getElementById(
            "pedidoPersonalizado"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove("active");

    document.body.style.overflow =
        "";

}


/* =========================================================
   ENVIAR PEDIDO PERSONALIZADO
========================================================= */

function enviarPedidoPersonalizado() {

    const nome =
        document.getElementById(
            "nomePersonalizado"
        );


    const descricao =
        document.getElementById(
            "descricaoPersonalizada"
        );


    const cep =
        document.getElementById(
            "cepPersonalizado"
        );


    if (!nome || !descricao) {

        return;

    }


    if (!nome.value.trim()) {

        alert(
            "Digite seu nome."
        );

        nome.focus();

        return;

    }


    if (!descricao.value.trim()) {

        alert(
            "Descreva o que você deseja."
        );

        descricao.focus();

        return;

    }


    /*
     * Aqui posteriormente podemos enviar
     * o pedido para um banco de dados,
     * WhatsApp ou backend.
     */

    alert(
        "Pedido personalizado preparado! ✨\n\n" +
        "Em breve podemos conectar esse formulário " +
        "diretamente ao sistema de pedidos."
    );

}


/* =========================================================
   MÁSCARA DE CEP
========================================================= */

function configurarMascaraCEP(id) {

    const campo =
        document.getElementById(id);


    if (!campo) {

        return;

    }


    campo.addEventListener(
        "input",
        () => {

            let valor =
                campo.value
                    .replace(/\D/g, "")
                    .slice(0, 8);


            if (valor.length > 5) {

                valor =
                    valor.slice(0, 5) +
                    "-" +
                    valor.slice(5);

            }


            campo.value =
                valor;

        }
    );

}


/* =========================================================
   MÁSCARA TELEFONE
========================================================= */

function configurarMascaraTelefone() {

    const campo =
        document.getElementById(
            "checkoutTelefone"
        );


    if (!campo) {

        return;

    }


    campo.addEventListener(
        "input",
        () => {

            let valor =
                campo.value
                    .replace(/\D/g, "")
                    .slice(0, 11);


            if (valor.length > 10) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{5})(\d{4}).*/,
                        "($1) $2-$3"
                    );

            } else if (
                valor.length > 6
            ) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{4})(\d{0,4}).*/,
                        "($1) $2-$3"
                    );

            } else if (
                valor.length > 2
            ) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{0,5}).*/,
                        "($1) $2"
                    );

            }


            campo.value =
                valor;

        }
    );

}


/* =========================================================
   MÁSCARA CARTÃO
========================================================= */

function configurarMascaraCartao() {

    const campo =
        document.getElementById(
            "numeroCartao"
        );


    if (!campo) {

        return;

    }


    campo.addEventListener(
        "input",
        () => {

            let valor =
                campo.value
                    .replace(/\D/g, "")
                    .slice(0, 16);


            valor =
                valor.replace(
                    /(\d{4})(?=\d)/g,
                    "$1 "
                );


            campo.value =
                valor;

        }
    );

}


/* =========================================================
   MÁSCARA VALIDADE
========================================================= */

function configurarMascaraValidade() {

    const campo =
        document.getElementById(
            "validadeCartao"
        );


    if (!campo) {

        return;

    }


    campo.addEventListener(
        "input",
        () => {

            let valor =
                campo.value
                    .replace(/\D/g, "")
                    .slice(0, 4);


            if (valor.length > 2) {

                valor =
                    valor.slice(0, 2) +
                    "/" +
                    valor.slice(2);

            }


            campo.value =
                valor;

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Carrinho */

        atualizarCarrinho();


        /* Checkout */

        carregarCheckout();


        /* Pesquisa */

        configurarPesquisa();


        /* Máscaras */

        configurarMascaraCEP(
            "cepDestino"
        );

        configurarMascaraCEP(
            "checkoutCEP"
        );

        configurarMascaraCEP(
            "cepPersonalizado"
        );

        configurarMascaraTelefone();

        configurarMascaraCartao();

        configurarMascaraValidade();


        /* =================================================
           DETECTAR CHECKOUT
        ================================================= */

        if (
            document.getElementById(
                "checkoutProdutos"
            )
        ) {

            selecionarPagamento(
                "pix"
            );

        }

    }
);