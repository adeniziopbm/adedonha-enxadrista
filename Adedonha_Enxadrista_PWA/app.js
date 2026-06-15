/* ADEDONHA ENXADRISTA FEM V2.1 */
let letraAtual = "";
let cronometro = null;
let tempoRestante = 120;
let partidaAtiva = false;
const TEMPO_TOTAL = 120;
const CHAVE_RANKING = "adedonha_enxadrista_fem_v2_1";

function normalizarTexto(texto){
  return String(texto || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}
function getEl(id){ return document.getElementById(id); }
function letrasDisponiveis(){
  return [
    "A","B","C","D","E","F","G",
    "H","I","L","M","N","O",
    "P","R","S","T","V"
  ];
  }
function gerarLetra(){
  const letras = letrasDisponiveis();
  return letras[Math.floor(Math.random()*letras.length)];
}
function atualizarCronometro(){
  const min = Math.floor(tempoRestante/60);
  const seg = tempoRestante%60;
  getEl("cronometro").innerText = `${String(min).padStart(2,"0")}:${String(seg).padStart(2,"0")}`;
}
function iniciarCronometro(){
  clearInterval(cronometro);
  tempoRestante = TEMPO_TOTAL;
  atualizarCronometro();
  cronometro = setInterval(()=>{
    tempoRestante--;
    atualizarCronometro();
    if(tempoRestante <= 0) finalizarPartida();
  },1000);
}
function pararCronometro(){ clearInterval(cronometro); }

function iniciarPartida(){
  const nome = getEl("nomeJogador").value.trim();
  if(!nome){ alert("Digite o nome do participante."); return; }
  letraAtual = gerarLetra();
  partidaAtiva = true;
  getEl("letraSorteada").innerText = letraAtual;
  getEl("pontuacaoAtual").innerText = "0";
  getEl("resultadoRodada").innerHTML = `Partida iniciada. Use a letra <strong>${letraAtual}</strong>. Boa sorte!`;
  getEl("telaCampeao").style.display = "none";
  iniciarCronometro();
}
function reiniciarPartida(){
  pararCronometro();
  partidaAtiva = false;
  tempoRestante = TEMPO_TOTAL;
  atualizarCronometro();
  getEl("letraSorteada").innerText = "?";
  getEl("pontuacaoAtual").innerText = "0";
  ["respostaPeca","respostaMovimento","respostaTatica","respostaEstrategia","respostaAbertura","respostaFinal","respostaEnxadrista"].forEach(id=>getEl(id).value="");
  getEl("resultadoRodada").innerHTML = "Aguardando respostas...";
  getEl("painelPontuacao").innerHTML = "0 pontos";
  getEl("medalhaJogador").innerHTML = "Nenhuma medalha";
  getEl("telaCampeao").style.display = "none";
}
function obterListaCategoria(categoria){ return (window.bancoTermos || bancoTermos || {})[categoria] || []; }
function encontrarTermo(categoria,resposta){
  const texto = normalizarTexto(resposta);
  return obterListaCategoria(categoria).find(item => normalizarTexto(item.termo) === texto);
}
function comecaComLetraCorreta(texto){ return normalizarTexto(texto).startsWith(letraAtual); }
function gerarSugestao(categoria){
  const candidatos = obterListaCategoria(categoria).filter(item => normalizarTexto(item.termo).startsWith(letraAtual));
  if(candidatos.length === 0) return null;
  return candidatos[Math.floor(Math.random()*candidatos.length)];
}
function feedbackCorreto(item){
  return `<div class="feedback"><div class="correto">✅ Correto</div><br><strong>${item.termo}</strong><br><br>${item.explicacao}<br><br>💡 ${item.curiosidade}</div>`;
}
function feedbackErro(categoria,resposta){
  const sugestao = gerarSugestao(categoria);
  return `<div class="feedback"><div class="errado">❌ Resposta inválida</div><br>"${resposta}" não foi encontrada no banco de termos desta categoria.<br><br>${sugestao ? `💡 Sugestão para a letra <strong>${letraAtual}</strong>: <strong>${sugestao.termo}</strong><br><br>${sugestao.explicacao}` : `Não há sugestão disponível para esta letra.`}</div>`;
}
function feedbackLetraErrada(resposta){
  return `<div class="feedback"><div class="errado">❌ A resposta não começa com a letra "${letraAtual}"</div><br>Você escreveu: <strong>${resposta}</strong><br><br>💡 Observe a letra sorteada antes de responder.</div>`;
}
function feedbackEmBranco(categoria){
  const sugestao = gerarSugestao(categoria);
  return `<div class="feedback"><div class="aviso">⚠️ Não respondeu</div><br>${sugestao ? `💡 Sugestão para aprender: <strong>${sugestao.termo}</strong><br><br>${sugestao.explicacao}<br><br>${sugestao.curiosidade}` : `Nenhuma sugestão disponível para esta categoria com a letra sorteada.`}</div>`;
}
function corrigirResposta(categoria,resposta){
  if(!resposta || resposta.trim()==="") return {correto:false,pontos:0,html:feedbackEmBranco(categoria)};
  if(!comecaComLetraCorreta(resposta)) return {correto:false,pontos:0,html:feedbackLetraErrada(resposta)};
  const termo = encontrarTermo(categoria,resposta);
  if(!termo) return {correto:false,pontos:0,html:feedbackErro(categoria,resposta)};
  return {correto:true,pontos:10,html:feedbackCorreto(termo), termo:termo.termo};
}
function obterMedalha(pontos){
  if(pontos <= 20) return {classe:"bronze",texto:"🥉 Aprendiz do Tabuleiro"};
  if(pontos <= 40) return {classe:"prata",texto:"🥈 Estrategista"};
  if(pontos <= 60) return {classe:"ouro",texto:"🥇 Mestre Tático"};
  return {classe:"grandemestre",texto:"🏆 Grande Mestre FEM"};
}

function finalizarPartida(){
  if(!letraAtual){ alert("Clique em Iniciar Partida antes de finalizar."); return; }
  pararCronometro();
  const mapa = [
    ["pecas","respostaPeca","♔ Peça"],
    ["movimentos","respostaMovimento","↔ Movimento"],
    ["taticas","respostaTatica","⚔ Tática"],
    ["estrategias","respostaEstrategia","🧠 Estratégia"],
    ["aberturas","respostaAbertura","📖 Abertura"],
    ["finais","respostaFinal","🏁 Final"],
    ["enxadristas","respostaEnxadrista","👑 Enxadrista"]
  ];
  const resultados = {};
  let total = 0;
  let detalhes = "";
  mapa.forEach(([cat,id,titulo])=>{
    const r = corrigirResposta(cat, getEl(id).value);
    resultados[cat] = r.correto;
    total += r.pontos;
    detalhes += `<hr><h3>${titulo}</h3>${r.html}`;
  });
  const tempoUtilizado = TEMPO_TOTAL - tempoRestante;
  const medalha = obterMedalha(total);
  getEl("pontuacaoAtual").innerText = total;
  getEl("medalhaJogador").innerHTML = `<span class="${medalha.classe}">${medalha.texto}</span>`;
  getEl("resultadoRodada").innerHTML = `<h2>Pontuação Final: ${total}/70</h2><p>⏱ Tempo utilizado: ${tempoUtilizado} segundos</p>${detalhes}`;
  getEl("painelPontuacao").innerHTML = `<h2>${total}/70</h2><p>Tempo: ${tempoUtilizado}s</p>`;
  mostrarTelaCampeao(total, tempoUtilizado, medalha);
  salvarPartida({
    nome:getEl("nomeJogador").value.trim() || "Participante",
    turma:getEl("turmaJogador").value.trim() || "-",
    letra:letraAtual,
    pontuacao:total,
    tempo:tempoUtilizado,
    medalha:medalha.texto,
    categorias:resultados,
    data:new Date().toLocaleString()
  });
  partidaAtiva = false;
  atualizarRanking();
  atualizarPainelProfessor();
}
function mostrarTelaCampeao(total, tempo, medalha){
  const nome = getEl("nomeJogador").value.trim() || "Participante";
  getEl("telaCampeao").style.display = "block";
  getEl("telaCampeao").innerHTML = `<h1>🏆 Resultado FEM</h1><p>Participante: <strong>${nome}</strong></p><div class="placar">${total}/70</div><p>⏱ Tempo: ${tempo}s</p><p class="${medalha.classe} medalha">${medalha.texto}</p><div class="botoes" style="justify-content:center"><button onclick="reiniciarPartida()">🔄 Nova Partida</button><button onclick="window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})">🏆 Ver Ranking</button></div>`;
}
function obterHistorico(){ return JSON.parse(localStorage.getItem(CHAVE_RANKING) || "[]"); }
function salvarPartida(partida){
  const historico = obterHistorico();
  historico.push(partida);
  localStorage.setItem(CHAVE_RANKING, JSON.stringify(historico));
}
function atualizarRanking(){
  const ranking = obterHistorico().sort((a,b)=> b.pontuacao===a.pontuacao ? a.tempo-b.tempo : b.pontuacao-a.pontuacao).slice(0,20);
  if(ranking.length===0){ getEl("rankingTurma").innerHTML="Nenhuma partida registrada."; return; }
  let html = `<table><thead><tr><th>Posição</th><th>Nome</th><th>Turma</th><th>Pontos</th><th>Tempo</th><th>Medalha</th></tr></thead><tbody>`;
  ranking.forEach((j,i)=> html += `<tr><td>${i+1}º</td><td>${j.nome}</td><td>${j.turma}</td><td>${j.pontuacao}</td><td>${j.tempo}s</td><td>${j.medalha || ""}</td></tr>`);
  html += `</tbody></table>`;
  getEl("rankingTurma").innerHTML = html;
}
function atualizarPainelProfessor(){
  const historico = obterHistorico();
  if(historico.length===0){
    ["totalPartidas","mediaTurma","maiorPontuacao","participantes"].forEach(id=>getEl(id).innerText="0");
    gerarEstatisticasCategorias();
    return;
  }
  getEl("totalPartidas").innerText = historico.length;
  getEl("maiorPontuacao").innerText = Math.max(...historico.map(j=>j.pontuacao));
  getEl("mediaTurma").innerText = (historico.reduce((t,j)=>t+j.pontuacao,0)/historico.length).toFixed(1);
  getEl("participantes").innerText = new Set(historico.map(j=>j.nome)).size;
  gerarEstatisticasCategorias();
}
function gerarEstatisticasCategorias(){
  const historico = obterHistorico();
  const nomes = {pecas:"Peças",movimentos:"Movimentos",taticas:"Táticas",estrategias:"Estratégias",aberturas:"Aberturas",finais:"Finais",enxadristas:"Enxadristas"};
  let html = "";
  Object.keys(nomes).forEach(cat=>{
    const total = historico.length;
    const acertos = historico.filter(p => p.categorias && p.categorias[cat]).length;
    const percentual = total ? Math.round((acertos/total)*100) : 0;
    html += `<p><strong>${nomes[cat]}</strong> — ${acertos}/${total} acertos</p><div class="barra"><div class="barra-interna" style="width:${percentual}%">${percentual}%</div></div>`;
  });
  getEl("estatisticasCategorias").innerHTML = html || "Nenhum dado disponível.";
}
function abrirPainelProfessor(){
  const painel = getEl("painelProfessor");
  painel.style.display = painel.style.display === "block" ? "none" : "block";
  atualizarPainelProfessor();
}
function limparHistorico(){
  if(!confirm("Deseja apagar todos os registros?")) return;
  localStorage.removeItem(CHAVE_RANKING);
  atualizarRanking();
  atualizarPainelProfessor();
}
function exportarCSV(){
  const historico = obterHistorico();
  if(historico.length===0){ alert("Nenhum dado para exportar."); return; }
  let csv = "Nome;Turma;Letra;Pontuacao;Tempo;Medalha;Data;Pecas;Movimentos;Taticas;Estrategias;Aberturas;Finais;Enxadristas\n";
  historico.forEach(i=>{
    const c = i.categorias || {};
    csv += `${i.nome};${i.turma};${i.letra};${i.pontuacao};${i.tempo};${i.medalha};${i.data};${!!c.pecas};${!!c.movimentos};${!!c.taticas};${!!c.estrategias};${!!c.aberturas};${!!c.finais};${!!c.enxadristas}\n`;
  });
  baixarArquivo("ranking_adedonha_enxadrista_fem.csv", csv, "text/csv;charset=utf-8;");
}
function exportarJSON(){
  baixarArquivo("dados_adedonha_enxadrista_fem.json", JSON.stringify(obterHistorico(), null, 2), "application/json");
}
function baixarArquivo(nome, conteudo, tipo){
  const blob = new Blob([conteudo], {type:tipo});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function alternarModoEscuro(){
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("modo_escuro", document.body.classList.contains("dark-mode"));
}
function carregarModoEscuro(){
  if(localStorage.getItem("modo_escuro")==="true") document.body.classList.add("dark-mode");
}
window.addEventListener("load",()=>{
  atualizarRanking();
  atualizarPainelProfessor();
  atualizarCronometro();
  carregarModoEscuro();
});
document.addEventListener("keydown",(e)=>{
  if(e.key==="F2") alternarModoEscuro();
});
console.log("♟️ Adedonha Enxadrista FEM V2.1 carregado");
