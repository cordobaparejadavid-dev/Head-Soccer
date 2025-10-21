var options_data = {
	cards:2, dificulty:"hard"
};

var json = localStorage.getItem("config");
	if(json)
		options_data = JSON.parse(json);

class GameScene extends Phaser.Scene {
    /*
    let l_partida = null;
	if (sessionStorage.idPartida && localStorage.partides){
		let arrayPartides = JSON.parse(localStorage.partides);
		if (sessionStorage.idPartida < arrayPartides.length)
			l_partida = arrayPartides[sessionStorage.idPartida];
	}
    */
   

    constructor (){
        super('GameScene');
        this.speed = 100;
        this.background = null;
        this.player = null;
        this.cursors = null;
        this.ball = null;
        this.ground = null;
        this.pause_label = null;
        this.enemy = null;
        this.Playerlabel = null;
        this.Enemylabel = null;
        this.Finishlabel = null;
        this.playerScore = 0
        this.enemyScore = 0
        this.victories = 0
        this.dificultatlvl = 20;
        this.temps = 1300
        
	}
   
    

    preload (){	
		this.load.image('Personatge', '../resources/Personatge.png');
		this.load.image('SpriteMovimiento', '../resources/SpriteMovimiento.svg');
        this.load.image('Mapa', '../resources/MapaJPG.jpg');
        this.load.image('Pilota', '../resources/Ball2.png');
        this.load.image('Terra', '../resources/Terra.png');
        this.load.image('Enemic', '../resources/Enemic.png');
	}
	
    create (){

        //Si hi ha partida carrega les coses d'aquesta partida, si no ho carrega tot nou
	    /*
        if (l_partida){
            this.player = l_partida.player;
            this.enemy = l_partida.enemy;
            this.ball = l_partida.ball;
            this.playerScore = l_partida.playerScore;
            this.enemyScore = l_partida.enemyScore;
        }
        else{
            this.player = this.physics.add.sprite(150 ,360,'Personatge').setCircle(80, 8, 20);
            this.player.setScale(0.45);
		    this.player.setCollideWorldBounds(true);
            this.enemy = this.physics.add.sprite(650 ,360,'Enemic').setCircle(80, 8, 20);
            this.enemy.setScale(0.45);
		    this.enemy.setCollideWorldBounds(true);
            this.ball = this.physics.add.sprite(400 ,160,'Pilota').setCircle(55, 0, -40);
        
            this.ball.setScale(0.5);
            //this.ball.setCollideWorldBounds(true);
        
            this.ball.body.setBounce(1);
            this.Playerlabel = this.add.text(340, 60, this.playerScore, { fill: '#fff' })
            this.Enemylabel = this.add.text(450, 60, this.enemyScore, { fill: '#fff' })
        }
        */
        switch (options_data.dificulty){
			case 'easy':
				this.temps = 2000;
				this.dificultatlvl = 10;
				break;
			case 'normal':
				this.temps = 1300;
				this.dificultatlvl = 20;
				break;
			case 'hard':
				this.temps = 700;
				this.dificultatlvl = 30;
				break;
		
		}
        
        this.background = this.add.image(400,300,'Mapa');

	    this.ground = this.physics.add.staticGroup();
		this.ground.create(0, 400, '').setScale(100, 0).refreshBody();
        //Mur sobre les porteries
        this.ground.create(0, 170, '').setScale(5, 0).refreshBody();
        this.ground.create(800, 170, '').setScale(5, 0).refreshBody();

        this.player = this.physics.add.sprite(150 ,360,'Personatge').setCircle(80, 8, 20);

        this.player.setScale(0.45);
		this.player.setCollideWorldBounds(true);
        this.enemy = this.physics.add.sprite(650 ,360,'Enemic').setCircle(80, 8, 20);

        this.enemy.setScale(0.45);
		this.enemy.setCollideWorldBounds(true);

        this.ball = this.physics.add.sprite(400 ,160,'Pilota').setCircle(55, 0, -40);
        
        this.ball.setScale(0.5);
        //this.ball.setCollideWorldBounds(true);
        
        this.ball.body.setBounce(1);

        this.Playerlabel = this.add.text(340, 60, this.playerScore, { fill: '#fff' })
        this.Enemylabel = this.add.text(450, 60, this.enemyScore, { fill: '#fff' })

        


        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;
        

        this.cursors = this.input.keyboard.createCursorKeys();

        
        this.Finishlabel = this.add.text(300, 200, '', { fill: '#fff' })
        .setStyle({ backgroundColor: '#111' })

        const continueButton = this.add.text(400, 260, '', { fill: '#fff' })
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: '#111' })
        .setInteractive({ useHandCursor: true })
        .setInteractive();
        continueButton.visible = false;
        
        //Col·lisions
        this.physics.add.collider(this.player, this.ball);
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.ball, this.ground);

        this.physics.add.collider(this.enemy, this.ball);
        this.physics.add.collider(this.enemy, this.ground);
        this.physics.add.collider(this.enemy, this.player);

        //Pausa i guardar partida
       
        const pauseButton = this.add.text(650, 0, 'Pause', { fill: '#fff' });
        pauseButton.setInteractive();

        const resumeButton = this.add.text(375, 245, 'Resume', { fill: '#fff' });
        resumeButton.setInteractive();
        resumeButton.visible = false;

        const saveButton = this.add.text(375, 275, 'Save', { fill: '#fff' });
        saveButton.setInteractive();
        saveButton.visible = false;

        const exitButton = this.add.text(375, 300, 'Exit', { fill: '#fff' });
        exitButton.setInteractive();
        exitButton.visible = false;

        pauseButton.on('pointerdown', () => { 
            this.ball.body.moves = false;
            this.player.body.moves = false;
            this.enemy.body.moves = false;
            resumeButton.visible = true;
            exitButton.visible = true;
            saveButton.visible = true;
        });

        saveButton.on('pointerdown', () => { 
            this.saveFile();
        });

        resumeButton.on('pointerdown', () => { 
            this.ball.body.moves = true;
            this.player.body.moves = true;
            this.enemy.body.moves = true;
            resumeButton.visible = false;
            exitButton.visible = false;
            saveButton.visible = false;
        });

        exitButton.on('pointerdown', () => { 
            loadpage("../index.html");
        });

        //final partit
        continueButton.on('pointerdown', () => {
            if (this.enemyScore > this.playerScore || this.victories == 3){
                loadpage("../index.html");
            }
            else{
                this.enemyScore = 0
                this.playerScore = 0
                this.create()
            }
        });

        if (this.playerScore == 3){
            this.ball.body.moves = false;
            this.player.body.moves = false;
            this.enemy.body.moves = false;
            if (this.victories == 1){
                this.Finishlabel.setText('Passes a la semifinal!!!')
            }
            else if (this.victories == 2){
                this.Finishlabel.setText('Passes a la Final!!!')
            }
            else{
                this.Finishlabel.setText('Felicitats ets el guanyador del torneig!!!')
            }
            continueButton.setText('Continuar')
            continueButton.visible = true;
        }
        else if ((this.enemyScore == 3)){
            this.ball.body.moves = false;
            this.player.body.moves = false;
            this.enemy.body.moves = false;
            this.Finishlabel.setText('Has sigut descalificat!!!')
            continueButton.setText('Sortir')
            continueButton.visible = true;
        }
        
        sessionStorage.clear();

        //continueButton.visible = false;

        //this.ball.body.moves = false;
        //this.player.body.moves = false;
        //this.enemy.body.moves = false;

	}
    
	update (){
    
        
        //enemic marca gol
        if (this.ball.body.position.x < 50 && this.ball.body.position.y > 170){
            this.enemyScore += 1
            this.Enemylabel.setText(this.enemyScore)
            this.create()
        }
        //player marca gol
        else if (this.ball.body.position.x > 725 && this.ball.body.position.y > 170){
            this.playerScore += 1
            this.Playerlabel.setText(this.playerScore)
            if (this.playerScore == 3){
                this.victories += 1;
            }
            this.create()
        }
        
        if (this.cursors.left.isDown){
            this.player.flipX=true;
            this.player.setVelocityX(-200);
          
        }
        else if (this.cursors.right.isDown){
            this.player.flipX=false;
            this.player.setVelocityX(200);
          
        }
        else{
            this.player.setVelocityX(0);
         
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
            this.player.setVelocityY(-350);

        
        //Moviment Enemic
        if (this.ball.body.position.x > this.enemy.body.position.x){
            this.enemy.setVelocityX(200);
            this.enemy.flipX=false;
            if(this.ball.body.position.x - this.enemy.body.position.x < 20 && this.enemy.body.touching.down){
                this.enemy.setVelocityY(-350);
            }
        }
        else{
            this.enemy.setVelocityX(-200);
            this.enemy.flipX=true;
            if(this.ball.body.position.y > this.ball.body.position.y && this.enemy.body.touching.down){
                this.enemy.setVelocityY(-350)
            }
        }

    

        if (this.ball.body.position.x < 20){
            this.ball.setVelocityX(300);
            this.ball.setVelocityY(-100);
        }

        if (this.ball.body.position.x > 750){
            this.ball.setVelocityX(-300);
            this.ball.setVelocityY(100);
        }

    }

    //Funcio que guarda els elements de la partida al local storage
    saveFile(){
        var partida = {
            player: this.player,
            enemy: this.enemy,
            ball: this.ball,
	        player_score: this.playerScore,
	        enemy_score: this.enemyScore
            
        };
        let arrayPartides = [];
		if(localStorage.partides){
			arrayPartides = JSON.parse(localStorage.partides);
			if(!Array.isArray(arrayPartides)) arrayPartides = [];
		}
		arrayPartides.push(partida);
		localStorage.partides = JSON.stringify(arrayPartides);
       
    };
    
    //Funcio que carrega els elements de la partida guardats al local storage
    loadFile (){
        var object = JSON.parse(localStorage.getItem('saveObject'));
        GameScene.player = object.player,
        GameScene.enemy = object.enemy,
        GameScene.ball = object.ball,
	    GameScene.player_score = object.playerScore,
	    GameScene.enemy_score = object.enemyScore
    };

}
