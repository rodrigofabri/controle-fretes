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

const valorDespesasAdicionais = document.getElementById("valorDespesasAdicionais");

let totalDespesasAdicionais = 0;

const totalDespesas = document.getElementById("totalDespesas");
const resultado = document.getElementById("resultado");
const btnSalvarFrete = document.getElementById("btnSalvarFrete");

function atualizarTotalDespesas() {

    const motorista = Number(valorFrete.value) * 0.13;

    const km = Number(distancia.value);
    const diesel = (km / 2.8) * 6.20;

    const total = motorista + diesel + totalDespesasAdicionais;

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

    valorMotorista.textContent = "R$ " + motorista.toFixed(2).replace(".", ",");
    atualizarTotalDespesas();

});

distancia.addEventListener("input", function () {

    const km = Number(distancia.value);

    const litros = km / 2.8;

    const diesel = litros * 6.20;

    valorDiesel.textContent = "R$ " + diesel.toFixed(2).replace(".", ",");
    atualizarTotalDespesas();

});

btnAdicionarDespesa.addEventListener("click", function () {

    let tipo = tipoDespesa.value;
const valor = Number(valorDespesa.value);

if (tipo === "" || valor <= 0) {
    alert("Selecione uma despesa e informe um valor válido.");
    return;
}

if (tipo === "Outros") {

    const nome = nomeOutro.value.trim();

    if (nome === "") {
        alert("Informe o nome da despesa.");
        return;
    }

    tipo = nome;

}

    const novaDespesa = document.createElement("div");

    novaDespesa.classList.add("item-despesa");

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
        "R$ " + totalDespesasAdicionais.toFixed(2).replace(".", ",");
    atualizarTotalDespesas();

    tipoDespesa.value = "";
    valorDespesa.value = "";

    campoOutro.style.display = "none";
    nomeOutro.value = "";

});

listaDespesas.addEventListener("click", function (evento) {

    if (evento.target.classList.contains("btn-excluir")) {

        evento.target.parentElement.remove();

    }

});

btnSalvarFrete.addEventListener("click", function () {

    const frete = {
        valor: Number(valorFrete.value),
        distancia: Number(distancia.value),
        data: document.getElementById("data").value,
        motorista: Number(valorFrete.value) * 0.13,
        diesel: (Number(distancia.value) / 2.8) * 6.20,
        despesasAdicionais: totalDespesasAdicionais
    };

    let fretes = JSON.parse(localStorage.getItem("fretes")) || [];

    fretes.push(frete);

    localStorage.setItem("fretes", JSON.stringify(fretes));
 
    alert("Frete salvo com sucesso!");

    valorFrete.value = "";
    distancia.value = "";
    document.getElementById("data").value = "";

    tipoDespesa.value = "";
    valorDespesa.value = "";

    listaDespesas.innerHTML = "";

    totalDespesasAdicionais = 0;

    valorDespesasAdicionais.textContent = "R$ 0,00";

    valorMotorista.textContent = "R$ 0,00";
    valorDiesel.textContent = "R$ 0,00";
    totalDespesas.textContent = "R$ 0,00";
    resultado.textContent = "R$ 0,00";

});

const listaFretes = document.getElementById("listaFretes");

if (listaFretes) {

    const fretesSalvos = JSON.parse(localStorage.getItem("fretes")) || [];

    console.log(fretesSalvos);

}