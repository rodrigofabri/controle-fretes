const listaMeses = document.getElementById("listaMeses");

const fretes = JSON.parse(localStorage.getItem("fretes")) || [];

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


// =========================
// ORGANIZAR POR MÊS
// =========================

const meses = {};

fretes.forEach(function (frete) {

    const data = new Date(
        frete.data + "T00:00:00"
    );

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


// =========================
// CRIAR OS MESES
// =========================

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


        // =========================
        // CALCULAR TOTAIS
        // =========================

        let receita = 0;
        let despesas = 0;

        fretesDoMes.forEach(function (frete) {

            const totalDespesas =
                frete.motorista +
                frete.diesel +
                frete.despesasAdicionais;

            receita += frete.valor;
            despesas += totalDespesas;

        });

        const resultado = receita - despesas;


        // =========================
        // BLOCO DO MÊS
        // =========================

        const blocoMes = document.createElement("div");

        blocoMes.classList.add("bloco-mes-index");


        // =========================
        // CABEÇALHO
        // =========================

        const cabecalho = document.createElement("div");

        cabecalho.classList.add("cabecalho-mes-index");

        cabecalho.innerHTML = `

            <div>

                <h2>
                    📅 ${nomeMes(dadosMes.mes)} ${dadosMes.ano}
                </h2>

                <p>
                    ${fretesDoMes.length} frete(s)
                    • Receita: ${formatarDinheiro(receita)}
                    • Resultado: ${formatarDinheiro(resultado)}
                </p>

            </div>

            <span class="seta-mes-index">
                ▼
            </span>

        `;


        // =========================
        // CONTEÚDO
        // =========================

        const conteudo = document.createElement("div");

        conteudo.classList.add("conteudo-mes-index");


        // =========================
        // CARDS
        // =========================

        conteudo.innerHTML = `

            <div class="cards">

                <div>
                    <h3>💰 Receita</h3>
                    <p>
                        ${formatarDinheiro(receita)}
                    </p>
                </div>

                <div>
                    <h3>💸 Despesas</h3>
                    <p>
                        ${formatarDinheiro(despesas)}
                    </p>
                </div>

                <div>
                    <h3>📈 Resultado</h3>
                    <p>
                        ${formatarDinheiro(resultado)}
                    </p>
                </div>

            </div>

        `;


        blocoMes.appendChild(cabecalho);
        blocoMes.appendChild(conteudo);

        listaMeses.appendChild(blocoMes);


        // =========================
        // ABRIR / FECHAR
        // =========================

        cabecalho.addEventListener("click", function () {

            const aberto =
                blocoMes.classList.contains("mes-aberto-index");


            // FECHAR TODOS
            document
                .querySelectorAll(".bloco-mes-index")
                .forEach(function (outroMes) {

                    outroMes.classList.remove(
                        "mes-aberto-index"
                    );

                });


            // ABRIR O CLICADO
            if (!aberto) {

                blocoMes.classList.add(
                    "mes-aberto-index"
                );

            }

        });

    });