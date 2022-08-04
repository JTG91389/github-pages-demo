// GLOBAL DOM / VARIABLES

document.addEventListener('DOMContentLoaded', main);

function main() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext('2d');
    const movement = document.getElementById('movement');
    const movement2 = document.getElementById('movement-2');
    const score = document.getElementById('scoreTest');
    const status = document.getElementById('status');
    let scoreValue = 0;
    score.textContent = scoreValue;
    const mushroom = document.createElement('img');
    mushroom.setAttribute('src', 'img/mush.png');
    
    let entities = [];
    let projectiles = [];
    const ogreDefaults = [{x: 5, y: 5},
    {x: -5, y: 5},
    {x: 5, y: -5},
    {x: -5, y: -5}]
    let endGame = false;
    
    let wPressed = false;
    let aPressed = false;
    let sPressed = false;
    let dPressed = false;
    
    // ====================== PAINT INTIAL SCREEN ======================= //
    
    // EVENT LISTENERS
    
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    status.addEventListener('click', restartGame, false);
    
    function keyDownHandler(event) {
        if(event.code === 'KeyW') {
            wPressed = true;
        } else if (event.code === 'KeyA') {
            aPressed = true;
        } else if (event.code === 'KeyS') {
            sPressed = true;
        } else if (event.code === 'KeyD') {
            dPressed = true;
        }
    }
    
    function keyUpHandler(event) {
        if(event.code == 'KeyW') {
            wPressed = false;
        } else if (event.code === 'KeyA') {
            aPressed = false;
        } else if (event.code === 'KeyS') {
            sPressed = false;
        } else if (event.code === 'KeyD') {
            dPressed = false;
        }
    }
    
    // ====================== SETUP FOR CANVAS RENDERING ======================= //
    // 2D rendering context for canvas element.
    // It is used for drawing shapes, text, images, and other objects.
    
    canvas.setAttribute('height', window.innerHeight);
    canvas.setAttribute('width', window.innerWidth);
    ctx.height = canvas.height;
    ctx.width = canvas.width;
    
    // ====================== SETUP FOR CANVAS RENDERING ======================= //
    
    
    // ====================== ENTITIES ======================= //
    
    class Crawler {
        constructor(x, y, color, width, height, type = 'player') {
            this.x = x;
            this.y = y;
            this.color = color;
            this.width = width;
            this.height = height;
            this.alive = true;
            this.type = type;
            this.img = mushroom;
            this.setMovement();
        }
    
        render() {
            if (this.alive && this.x >= -10 && this.x < canvas.width && this.y >= -10 && this.y < canvas.height) {
                if (this.type === 'ogre') {
                    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
                } else {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }
        }
    
        npcMovement() {
            if (this.type === 'ogre') {
                if ((this.x < 0 || this.x > canvas.width - this.width) ||
                (this.y < 0 || this.y > canvas.height - this.height)) {
                    this.bounceOffWall();
                }
                this.x += this.modifierX;
                this.y += this.modifierY;
                if (Math.floor(Math.random() * 100) === 1) {
                    this.fireball();
                }
            } else if (this.type === 'projectile') {
                if ((this.x <= 0 || this.x > canvas.width - this.width) ||
                (this.y <= 0 || this.y > canvas.height - this.height)) {
                    this.alive = false;
                }
                this.x += this.modifierX;
                this.y += this.modifierY;
            }
        }
    
        setMovement() {
            if (this.type === 'ogre' || this.type === 'projectile') {
                const direction = ogreDefaults[Math.floor(Math.random() * 4)];
                this.modifierX = direction.x;
                this.modifierY = direction.y;
            }
        }
    
        bounceOffWall() {
            if (this.type === 'ogre') {
                const adjusterX = Math.random() * 3;
                const adjusterY = Math.random() * 3;
                this.modifierX = this.x <= 0 ? 5 * adjusterX : -5 * adjusterX;
                this.modifierY = this.y <= 0 ? 5 * adjusterY : -5 * adjusterY;
            }
        }
     
        fireball() {
            if (this.alive) {
                const fireball = new Crawler(this.x, this.y, 'red', 10, 10, 'projectile');
                if (Math.floor(Math.random() * 2) === 1) {
                    fireball.modifierX = this.modifierX * -1;
                } else {
                    fireball.modifierY = this.modifierY * -1;
                }
                projectiles.push(fireball);
            }
        }
    }
    
    let donkey = new Crawler(50, 50, 'blue', 35, 35);
    entities.push(donkey);
    let shrek = new Crawler(300,300, 'green', 75, 100, 'ogre');
    entities.push(shrek);
    
    // ====================== HELPER FUNCTIONS ======================= //
    
    function addNewShrek() {
        if (shrek.alive) {
            shrek.alive = false;
            setTimeout(function() {
                entities.pop();
                let x = Math.floor(Math.random() * canvas.width) - 40;
                let y = Math.floor(Math.random() * canvas.height) - 80;
                shrek = new Crawler(x, y, 'green', 75, 100, 'ogre');
                shrek.alive == true;
                // shrek.setMovement();
                entities.push(shrek);
            }, 3000);
            return true;
        }
    }
    
    function displayCords() {
        //show donkey cords
        movement.textContent = `X: ${donkey.x} \n Y: ${donkey.y}`;
        // show shrek cords
        movement2.textContent = `X: ${shrek.x} \n Y: ${shrek.y}`;
    }
    
    function restartGame() {
        if (endGame) {
            scoreValue = 0;
            score.textContent = scoreValue;
            status.textContent = 'playing the game';
            entities = [];
            projectiles = [];
            donkey = new Crawler(50, 50, 'blue', 35, 35);
            entities.push(donkey);
            shrek = new Crawler(300,300, 'green', 100, 35, 'ogre');
            entities.push(shrek);
            endGame = false;
        }
    }
    
    //  GUI
    
    //  KEYBOARD INTERACTION LOGIC
    
    // ====================== GAME PROCESSES ======================= //
    
    // ====================== COLLISION DETECTION ======================= //
    
    function overlap(a, b, direction) {
        if (a instanceof Crawler &&
            b instanceof Crawler ) {
            const aTopLeft = {
                x: a.x,
                y: a.y
            };
            const aBottomRight = {
                x: a.x + a.width,
                y: a.y + a.height
            }
            const bTopLeft = {
                x: b.x,
                y: b.y
            }
            const bBottomRight = {
                x: b.x + b.width,
                y: b.y + b.height
            }
    
            // if a is left of b
            if (aBottomRight.x < bTopLeft.x) {
                return false;
            }
    
            // if a is above b
            if (aBottomRight.y < bTopLeft.y) {
                return false;
            }
    
            // if a is below b
            if (aTopLeft.y > bBottomRight.y && direction === 'up') {
                return {
                    direction: 'up',
                    bool: false
                };
            }
    
            // is a is right of be
            if (aTopLeft.x > bBottomRight.x) {
                return false;
            }
    
            return true;
        }
        return false;
    }
    
    function addScore(change) {
        scoreValue += change;
        score.textContent = scoreValue;
    }
    
    function collisionDetection(direction) {
        const collision = overlap(donkey, shrek, direction);
        if (shrek.alive && collision.bool === false && collision.direction === direction) {
            addNewShrek();
            addScore(10)
        }
        projectiles = projectiles.filter((projectile) => {
            if (projectile.alive && donkey.alive && overlap(donkey, projectile)) {
                donkey.alive = false;
                projectile.alive = false;
                endGame = true;
                return false;
            }
            return projectile.alive;
        })
    }
    
    // **********************************
    // CODE STASH FOR OLD CODE
    // **********************************
    
    function draw() {
        if (!endGame) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            entities.forEach((entity) => {
                if (entity.type === 'ogre') {
                    entity.npcMovement();
                }
                entity.render();
            });
            projectiles.forEach((entity) => {
                entity.npcMovement();
                entity.render();
            });
            displayCords();
            collisionDetection();
        
            if (wPressed && donkey.y > 0) {
                donkey.y -= 5;
            } else if (sPressed && donkey.y + donkey.height < canvas.height) {
                donkey.y += 5;
            }
        
            if (aPressed && donkey.x > 0) {
                donkey.x -= 5;
            } else if (dPressed && donkey.x + donkey.width < canvas.width) {
                donkey.x += 5;
            }
        } else {
            status.textContent = 'Game Over, click to play again'; 
        }
    }
    
    setInterval(draw, 10);
}
