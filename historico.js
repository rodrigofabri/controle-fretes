let fretesSalvos = JSON.parse(localStorage.getItem("fretes")) || [];

const listaFretes = document.getElementById("listaFretes");

function formatarDinheiro(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function nomeMes(numeroMes) {
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    return meses[numeroMes];
}

function renderizarHistorico() {

    listaFretes.innerHTML = "";

    // ORGANIZAR POR MÊS
    const meses = {};

    fretesSalvos.forEach(function (frete) {

        const data = new Date(frete.data + "T00:00:00");

        const mes = data.getMonth();
        const ano = data.getFullYear();

        const chaveMes = ano + "-" + mes;

        if (!meses[chaveMes]) {
            meses[chaveMes] = {
                mes: mes,
                ano: ano,
                fretes: []
            };
        }

        meses[chaveMes].fretes.push(frete);

    });

    // CRIAR CADA MÊS
    Object.keys(meses)
    .sort(function (a, b) {

        const [anoA, mesA] = a.split("-").map(Number);
        const [anoB, mesB] = b.split("-").map(Number);

        if (anoA !== anoB) {
            return anoA - anoB;
        }

        return mesA - mesB;

    })
    .forEach(function (chaveMes) {

            const dadosMes = meses[chaveMes];

            const fretesDoMes = dadosMes.fretes;

            // CALCULAR RESUMO DO MÊS
            let receitaMes = 0;
            let despesasMes = 0;

            fretesDoMes.forEach(function (frete) {

                const totalDespesas =
                    frete.motorista +
                    frete.diesel +
                    frete.despesasAdicionais;

                receitaMes += frete.valor;
                despesasMes += totalDespesas;

            });

            const resultadoMes =
                receitaMes - despesasMes;

            // =========================
            // CABEÇALHO DO MÊS
            // =========================

            const blocoMes = document.createElement("div");

            blocoMes.classList.add("bloco-mes");

            const cabecalhoMes = document.createElement("div");

            cabecalhoMes.classList.add("cabecalho-mes");

            cabecalhoMes.innerHTML = `

                <div>
                    <h2>
                        📅 ${nomeMes(dadosMes.mes)} ${dadosMes.ano}
                    </h2>

                    <p>
                        ${fretesDoMes.length} frete(s)
                        • Receita: ${formatarDinheiro(receitaMes)}
                        • Resultado: ${formatarDinheiro(resultadoMes)}
                    </p>
                </div>

                <span class="seta-mes">▼</span>

            `;

            blocoMes.appendChild(cabecalhoMes);

            // =========================
            // CONTEÚDO DO MÊS
            // =========================

            const conteudoMes = document.createElement("div");

            conteudoMes.classList.add("conteudo-mes");

            // ORGANIZAR POR SEMANA
            const semanas = {};

            fretesDoMes.forEach(function (frete) {

                const data = new Date(
                    frete.data + "T00:00:00"
                );

                const dia = data.getDate();

                let numeroSemana;

                if (dia <= 7) {
                    numeroSemana = 1;
                } else if (dia <= 14) {
                    numeroSemana = 2;
                } else if (dia <= 21) {
                    numeroSemana = 3;
                } else if (dia <= 28) {
                    numeroSemana = 4;
                } else {
                    numeroSemana = 5;
                }

                if (!semanas[numeroSemana]) {
                    semanas[numeroSemana] = [];
                }

                semanas[numeroSemana].push(frete);

            });

            Object.keys(semanas).forEach(function (numeroSemana) {

                semanas[numeroSemana].sort(function (a, b) {

                    return new Date(a.data + "T00:00:00") -
                        new Date(b.data + "T00:00:00");

                });

            });

            // CRIAR CADA SEMANA
            Object.keys(semanas).forEach(function (numeroSemana) {

                let receitaSemana = 0;
                let despesasSemana = 0;

                semanas[numeroSemana].forEach(function (frete) {

                    const totalDespesas =
                        frete.motorista +
                        frete.diesel +
                        frete.despesasAdicionais;

                    receitaSemana += frete.valor;
                    despesasSemana += totalDespesas;

                });

                const resultadoSemana =
                    receitaSemana - despesasSemana;

                const tituloSemana = document.createElement("h2");

                tituloSemana.classList.add("titulo-semana");

                tituloSemana.textContent =
                    "Semana " + numeroSemana;

                conteudoMes.appendChild(tituloSemana);

                // RESUMO SEMANAL
                const resumoSemana = document.createElement("div");

                resumoSemana.classList.add("resumo-semana");

                resumoSemana.innerHTML = `

                    <p>
                        🚛 Fretes:
                        <strong>
                            ${semanas[numeroSemana].length}
                        </strong>
                    </p>

                    <p>
                        💰 Receita:
                        <strong>
                            ${formatarDinheiro(receitaSemana)}
                        </strong>
                    </p>

                    <p>
                        💸 Despesas:
                        <strong>
                            ${formatarDinheiro(despesasSemana)}
                        </strong>
                    </p>

                    <p>
                        📈 Resultado:
                        <strong>
                            ${formatarDinheiro(resultadoSemana)}
                        </strong>
                    </p>

                `;

                conteudoMes.appendChild(resumoSemana);

                // CARDS DOS FRETES
                semanas[numeroSemana].forEach(function (frete) {

                    const totalDespesas =
                        frete.motorista +
                        frete.diesel +
                        frete.despesasAdicionais;

                    const resultado =
                        frete.valor - totalDespesas;

                    const item = document.createElement("div");

                    item.classList.add("card-frete");

                    const id = fretesSalvos.indexOf(frete);

                    item.dataset.id = id;

                    item.innerHTML = `

                        <div class="cabecalho-frete">

                            <div>

                                <h3>🚛 ${frete.origem || "Origem não informada"} → ${frete.destino || "Destino não informado"}</h3>

                                <span>
                                    📅 ${frete.data.split("-").reverse().join("/")}
                                </span>

                            </div>

                            <div class="valor-frete-card">

                                ${formatarDinheiro(frete.valor)}

                            </div>

                        </div>

                        <div class="info-frete">

                            <div>

                                <span>📍 Distância</span>

                                <strong>
                                    ${frete.distancia} km
                                </strong>

                            </div>

                            <div>

                                <span>👨‍✈️ Motorista</span>

                                <strong>
                                    ${formatarDinheiro(frete.motorista)}
                                </strong>

                            </div>

                            <div>

                                <span>⛽ Diesel</span>

                                <strong>
                                    ${formatarDinheiro(frete.diesel)}
                                </strong>

                            </div>

                            <div>

                                <span>🧾 Adicionais</span>

                                <strong>
                                    ${formatarDinheiro(frete.despesasAdicionais)}
                                </strong>

                            </div>

                        </div>

                        <div class="resultado-frete">

                            <span>
                                📈 Resultado do frete
                            </span>

                            <strong>
                                ${formatarDinheiro(resultado)}
                            </strong>

                        </div>

                        <button
                            type="button"
                            class="btn-excluir-frete"
                        >
                            🗑️ Excluir frete
                        </button>

                    `;

                    conteudoMes.appendChild(item);

                });

            });

            // TOTAL DO MÊS
            const tituloTotal = document.createElement("h2");

            tituloTotal.classList.add("titulo-total-mes");

            tituloTotal.textContent =
                "📊 Total de " +
                nomeMes(dadosMes.mes);

            conteudoMes.appendChild(tituloTotal);

            const resumoMes = document.createElement("div");

            resumoMes.classList.add("resumo-mes");

            resumoMes.innerHTML = `

                <p>
                    🚛 Fretes:
                    <strong>
                        ${fretesDoMes.length}
                    </strong>
                </p>

                <p>
                    💰 Receita:
                    <strong>
                        ${formatarDinheiro(receitaMes)}
                    </strong>
                </p>

                <p>
                    💸 Despesas:
                    <strong>
                        ${formatarDinheiro(despesasMes)}
                    </strong>
                </p>

                <p>
                    📈 Resultado:
                    <strong>
                        ${formatarDinheiro(resultadoMes)}
                    </strong>
                </p>

            `;

            conteudoMes.appendChild(resumoMes);

            // COLOCAR O CONTEÚDO DENTRO DO BLOCO
            blocoMes.appendChild(conteudoMes);

            // CLIQUE PARA ABRIR/FECHAR
            cabecalhoMes.addEventListener("click", function () {

                const aberto =
                    blocoMes.classList.contains("mes-aberto");

                // FECHAR TODOS
                document
                    .querySelectorAll(".bloco-mes")
                    .forEach(function (outroMes) {

                        outroMes.classList.remove("mes-aberto");

                    });

                // ABRIR O CLICADO
                if (!aberto) {
                    blocoMes.classList.add("mes-aberto");
                }

            });

            listaFretes.appendChild(blocoMes);

        });

}

listaFretes.addEventListener("click", function (evento) {

    if (
        evento.target.classList.contains("btn-excluir-frete")
    ) {

        const card = evento.target.parentElement;

        const id = Number(card.dataset.id);

        const confirmar = confirm(
            "Tem certeza que deseja excluir este frete?"
        );

        if (!confirmar) {
            return;
        }

        fretesSalvos.splice(id, 1);

        localStorage.setItem(
            "fretes",
            JSON.stringify(fretesSalvos)
        );

        renderizarHistorico();

    }

});

renderizarHistorico();