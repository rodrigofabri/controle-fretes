const valorFrete = document.getElementById("valorFrete");
const valorFreteResumo = document.getElementById("valorFreteResumo");
const valorMotorista = document.getElementById("valorMotorista");
const distancia = document.getElementById("distancia");
const valorDiesel = document.getElementById("valorDiesel");

const tipoDespesa = document.getElementById("despesa");
const valorDespesa = document.getElementById("valorDespesa");
const btnAdicionarDespesa = document.getElementById("btnAdicionarDespesa");
const listaDespesas = document.getElementById("listaDespesas");

const campoOutro = document.getElementById("campoOutro");
const nomeOutro = document.getElementById("nomeOutro");

tipoDespesa.addEventListener("change", function () {

    if (tipoDespesa.value === "Outros") {

        campoOutro.style.display = "block";

    } else {

        campoOutro.style.display = "none";
        nomeOutro.value = "";

    }

});

const valorDespesasAdicionais =
    document.getElementById("valorDespesasAdicionais");

let totalDespesasAdicionais = 0;

const totalDespesas = document.getElementById("totalDespesas");
const resultado = document.getElementById("resultado");
const btnSalvarFrete = document.getElementById("btnSalvarFrete");

function atualizarTotalDespesas() {

    const motorista = Number(valorFrete.value) * 0.13;

    const km = Number(distancia.value);
    const diesel = (km / 2.8) * 6.20;

    const total =
        motorista +
        diesel +
        totalDespesasAdicionais;

    totalDespesas.textContent =
        "R$ " + total.toFixed(2).replace(".", ",");

    const valor = Number(valorFrete.value);

    const lucro = valor - total;

    resultado.textContent =
        "R$ " + lucro.toFixed(2).replace(".", ",");
}

valorFrete.addEventListener("input", function () {

    const valor = Number(valorFrete.value);

    const motorista = valor * 0.13;

    valorFreteResumo.textContent =
        "R$ " + valor.toFixed(2).replace(".", ",");

    valorMotorista.textContent =
        "R$ " + motorista.toFixed(2).replace(".", ",");

    atualizarTotalDespesas();

});

distancia.addEventListener("input", function () {

    const km = Number(distancia.value);

    const litros = km / 2.8;

    const diesel = litros * 6.20;

    valorDiesel.textContent =
        "R$ " + diesel.toFixed(2).replace(".", ",");

    atualizarTotalDespesas();

});

btnAdicionarDespesa.addEventListener("click", function () {

    let tipo = tipoDespesa.value;

    const valor = Number(valorDespesa.value);

    if (tipo === "" || valor <= 0) {

        alert(
            "⚠️ DESPESA INVÁLIDA\n\n" +
            "Selecione o tipo da despesa e informe um valor maior que zero."
        );

        return;
    }

    if (tipo === "Outros") {

        const nome = nomeOutro.value.trim();

        if (nome === "") {

            alert(
                "⚠️ NOME DA DESPESA NÃO INFORMADO\n\n" +
                "Informe o nome da despesa personalizada.\n\n" +
                "Exemplo: Descarga"
            );

            return;
        }

        tipo = nome;

    }

    const novaDespesa =
    document.createElement("div");

novaDespesa.classList.add("item-despesa");

novaDespesa.dataset.valor = valor;

    novaDespesa.innerHTML = `
        <span>
            🧾 ${tipo} — R$ ${valor.toFixed(2).replace(".", ",")}
        </span>

        <button type="button" class="btn-excluir">
            Excluir
        </button>
    `;

    listaDespesas.appendChild(novaDespesa);

    totalDespesasAdicionais += valor;

    valorDespesasAdicionais.textContent =
        "R$ " +
        totalDespesasAdicionais
            .toFixed(2)
            .replace(".", ",");

    atualizarTotalDespesas();

    tipoDespesa.value = "";
    valorDespesa.value = "";

    campoOutro.style.display = "none";
    nomeOutro.value = "";

});

listaDespesas.addEventListener("click", function (evento) {

    if (
        evento.target.classList.contains("btn-excluir")
    ) {

        const item = evento.target.parentElement;

        const valor = Number(item.dataset.valor);

        totalDespesasAdicionais -= valor;

        valorDespesasAdicionais.textContent =
            "R$ " +
            totalDespesasAdicionais
                .toFixed(2)
                .replace(".", ",");

        atualizarTotalDespesas();

        item.remove();

    }

});

btnSalvarFrete.addEventListener("click", function () {

    const origem =
        document.getElementById("origem").value.trim();

    const destino =
        document.getElementById("destino").value.trim();

    const valor =
        Number(valorFrete.value);

    const km =
        Number(distancia.value);

    const data =
        document.getElementById("data").value;

    const formatoLocal =
    /^[A-Za-zÀ-ÿ]+(?:[\s'-/][A-Za-zÀ-ÿ]+)*[\s'-/]+[A-Za-zÀ-ÿ]{2}$/i;


    // =========================
    // VALIDAR ORIGEM
    // =========================

    if (origem === "") {

        alert(
            "⚠️ ORIGEM NÃO INFORMADA\n\n" +
            "Você precisa informar a cidade de origem do frete.\n\n" +
            "Exemplo: Indiana - SP"
        );

        return;
    }

    if (!formatoLocal.test(origem)) {

        alert(
            "⚠️ ORIGEM INVÁLIDA\n\n" +
            "A origem precisa ser informada como uma cidade e estado.\n\n" +
            "Exemplo: Indiana - SP"
        );

        return;
    }


    // =========================
    // VALIDAR DESTINO
    // =========================

    if (destino === "") {

        alert(
            "⚠️ DESTINO NÃO INFORMADO\n\n" +
            "Você precisa informar a cidade de destino do frete.\n\n" +
            "Exemplo: São Paulo - SP"
        );

        return;
    }

    if (!formatoLocal.test(destino)) {

        alert(
            "⚠️ DESTINO INVÁLIDO\n\n" +
            "O destino precisa ser informado como uma cidade e estado.\n\n" +
            "Exemplo: São Paulo - SP"
        );

        return;
    }


    // =========================
    // VALIDAR VALOR
    // =========================

    if (valor <= 0) {

        alert(
            "⚠️ VALOR DO FRETE INVÁLIDO\n\n" +
            "O valor do frete precisa ser maior que R$ 0,00.\n\n" +
            "Exemplo: R$ 5.000,00"
        );

        return;
    }


    // =========================
    // VALIDAR DISTÂNCIA
    // =========================

    if (km <= 0) {

        alert(
            "⚠️ DISTÂNCIA INVÁLIDA\n\n" +
            "A distância precisa ser maior que 0 km.\n\n" +
            "Exemplo: 560 km"
        );

        return;
    }


    // =========================
    // VALIDAR DATA
    // =========================

    if (data === "") {

        alert(
            "⚠️ DATA NÃO INFORMADA\n\n" +
            "Informe a data em que o frete foi realizado."
        );

        return;
    }


    // =========================
    // CRIAR FRETE
    // =========================

    const frete = {

        valor: valor,

        distancia: km,

        data: data,

        origem: origem,

        destino: destino,

        motorista: valor * 0.13,

        diesel: (km / 2.8) * 6.20,

        despesasAdicionais:
            totalDespesasAdicionais

    };


    // =========================
// SALVAR OU EDITAR
// =========================

let fretes =
    JSON.parse(
        localStorage.getItem("fretes")
    ) || [];

const freteEditando =
    localStorage.getItem("freteEditando");

if (freteEditando !== null) {

    const id = Number(freteEditando);

    fretes[id] = frete;

    localStorage.setItem(
        "fretes",
        JSON.stringify(fretes)
    );

    localStorage.removeItem("freteEditando");

    alert(
        "✅ FRETE ALTERADO COM SUCESSO!\n\n" +
        origem +
        " → " +
        destino
    );

} else {

    fretes.push(frete);

    localStorage.setItem(
        "fretes",
        JSON.stringify(fretes)
    );

    alert(
        "✅ FRETE SALVO COM SUCESSO!\n\n" +
        origem +
        " → " +
        destino
    );

}


    // =========================
    // LIMPAR FORMULÁRIO
    // =========================

    valorFrete.value = "";

    distancia.value = "";

    document.getElementById("origem").value = "";

    document.getElementById("destino").value = "";

    document.getElementById("data").value = "";

    tipoDespesa.value = "";

    valorDespesa.value = "";

    listaDespesas.innerHTML = "";

    totalDespesasAdicionais = 0;

    valorDespesasAdicionais.textContent =
        "R$ 0,00";

    valorFreteResumo.textContent =
        "R$ 0,00";

    valorMotorista.textContent =
        "R$ 0,00";

    valorDiesel.textContent =
        "R$ 0,00";

    totalDespesas.textContent =
        "R$ 0,00";

    resultado.textContent =
        "R$ 0,00";

});


// =========================
// COMPATIBILIDADE COM HISTÓRICO
// =========================

const listaFretes =
    document.getElementById("listaFretes");

if (listaFretes) {

    const fretesSalvos =
        JSON.parse(
            localStorage.getItem("fretes")
        ) || [];

    console.log(fretesSalvos);

}

// =========================
// CARREGAR FRETE PARA EDIÇÃO
// =========================

const freteEditando =
    localStorage.getItem("freteEditando");

if (freteEditando !== null) {

    const fretes =
        JSON.parse(
            localStorage.getItem("fretes")
        ) || [];

    const frete =
        fretes[Number(freteEditando)];

    if (frete) {

        valorFrete.value = frete.valor;

        distancia.value = frete.distancia;

        document.getElementById("origem").value =
            frete.origem || "";

        document.getElementById("destino").value =
            frete.destino || "";

        document.getElementById("data").value =
            frete.data || "";

        valorFrete.dispatchEvent(
            new Event("input")
        );

        distancia.dispatchEvent(
            new Event("input")
        );

    }
}

