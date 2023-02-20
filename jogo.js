console.log('to fazendo meu flappybird gente');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos_hit.wav';;
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,
    SpriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
        sprites,
        planoDeFundo.spriteX, planoDeFundo.SpriteY,
        planoDeFundo.largura, planoDeFundo.altura,
        planoDeFundo.x, planoDeFundo.y,
        planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
        sprites,
        planoDeFundo.spriteX, planoDeFundo.SpriteY,
        planoDeFundo.largura, planoDeFundo.altura,
        (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
        planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

//[CHÃO]

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height -112,
        atualiza() {
           const movimentoDoChao = 1;
           const repeteEm = chao.largura / 2;
           const movimentacao = chao.x - movimentoDoChao;  //até aqui tudo bem, mas como o chão tem um tamanho, começa faltar chao, mas qual o tamanho do chão?
           chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        }
    };
    return chao;
}

//[TELA INICIAL]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width/2) - 174/2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h,
        );
    }
}

const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width/2) - 226/2, // aqu centraliza
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.w, mensagemGameOver.h,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.w, mensagemGameOver.h,
        );
    }
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }
    return false;
}

//passárinho
function criaFlappyBird(){  // colocamos o flappybird dentro de uma função pq ele estava sendo um objeto com variaveis globais, e precisamos reiniciar as variaveis
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,   //sx e sy
        largura: 33,
        altura: 24, // tamanho do recorte na sprite
        x: 10,
        y: 50, // a posição que a gente quer colocar ele no canvass
        velocidade: 0,
        pulo: 4.6,
        pula() {
            // console.log('[antes]', flappyBird.velocidade);
            flappyBird.velocidade = - flappyBird.pulo; // cara sensasional, oq foi feito aqui? como a velocidade é uma constante que fica aumentando o eixo Y, o pular nada mais é que tirar y na negativo, entendeu? outra explicação seria, gravidade y pra baixo, o pular é y para cima
            // console.log('[depois]', flappyBird.velocidade);
        },
        gravidade: 0.20,
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                // console.log("fez colisão");
                som_HIT.play();

              
                
                mudaParaTela(Telas.GAME_OVER);
                return;
            }
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade,
        flappyBird.y = flappyBird.y + flappyBird.velocidade; // eu to chamando a posição dele e sempre adicionando 1
        },
        movimentos: [   {spriteX: 0, spriteY: 0, },  // asa para cima
                        {spriteX: 0, spriteY: 26, }, // asa médio
                        {spriteX: 0, spriteY: 52, },  // asa para baixo
                        {spriteX: 0, spriteY: 26, } // asa médio
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;  // quando passar 10 frames ele vai passar o intervalo pq o resto é ===0
            // console.log(passouOIntervalo)

            if(passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepetição = flappyBird.movimentos.length;
                // console.log(incremento);
                flappyBird.frameAtual = incremento % baseRepetição;
            }
        },
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]
            contexto.drawImage(   //vamos desenhar o passarinnho
                // (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                // (é a nossa imagem,; qual o pedaço que a gente quer pegar; o tamanho da imagem q a gnt quer;)
                    sprites, //image
                    spriteX, spriteY, //sx e sy
                    flappyBird.largura, flappyBird.altura,// tamanho do recorte na sprite
                    flappyBird.x, flappyBird.y, // a posição     que a gente quer colocar ele no canvas
                    flappyBird.largura, flappyBird.altura, //o tamanho que a gente quer no canvas
              );
        },
    }
    return flappyBird;
}

function criaCanos() {
    const canos ={
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
                        //para nao ficarem fixo
            canos.pares.forEach(function(par){

                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                // [Cano do Ceu]
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )
                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })

        },



        temColisaoComOFlappyBird(par) { // como a gente vai verificar isso? 1o o passrinho precisa estar na mesma posição que X, segundo, ele tem que estar coincidindo com um valor de y
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {

                if(cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if(peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }

            return false;  //para acabar aqui
        },
        pares: [],
        atualiza() {
            const passou100Frames = frames % 100 === 0; // acada 100 frames q passar o resto vai ser 0
            if(passou100Frames) {
                console.log('passou 100')
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function(par){
                par.x = par.x - 2;


            if(canos.temColisaoComOFlappyBird(par)){
                console.log("Você perdeu!");
                som_HIT.play();
                mudaParaTela(Telas.GAME_OVER);
            }


                if(par.x + canos.largura <= 0){
                    canos.pares.shift();
                }
            });
        }
    }

    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha(){
            contexto.font = '35px Macondo';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao} Segundos`, canvas.width - 8, 30);
            placar.pontuacao
        },
        atualiza(){
            const intervaloDeFrames = 60;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo){
                placar.pontuacao = placar.pontuacao + 1;
                console.log("chegou aqui")
            }
        },
    
    }
    
    return placar;
}


//
// [telas]
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
};


const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO); // ao clicar ele muda a tela
        },
        atualiza() {
            globais.chao.atualiza()
        }
    }
};

Telas.JOGO = {
    inicializa() {
        globais.placar = criaPlacar();
    },
    desenha() {
        planoDeFundo.desenha(); // a ordem aqui importa
        globais.canos.desenha();
        globais.chao.desenha()
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click() {  // ai clicar ele ativa o pula()
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();  // precisa chamar pra atualiza
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.placar.atualiza();

    }
};

Telas.GAME_OVER = {
    desenha() {
        mensagemGameOver.desenha();
    },
    atualiza(){

    },
    click() {
        mudaParaTela(Telas.INICIO);
    }
}

function loop() {   //isso vai fazer deixar sempre as coisas renderizadas

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1; // para cada loop, é para adicionar um contador

    requestAnimationFrame(loop);
}


window.addEventListener('click', function() {
    if (telaAtiva.click); {
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop();
