class Player extends EngineObject {

    constructor(position, size, tileIndex){
        super(position, size, tileIndex);

        this.moveInput = vec2();
        this.setCollision(1);
    }


    update(){
         // movement control
         this.moveInput = vec2(keyIsDown(39) - keyIsDown(37), keyIsDown(38) - keyIsDown(40));

        
         const maxCharacterSpeed = .1;
         this.velocity.x = clamp(this.velocity.x + this.moveInput.x * .042, -maxCharacterSpeed, maxCharacterSpeed);
         this.velocity.y = clamp(this.velocity.y + this.moveInput.y * .042, -maxCharacterSpeed, maxCharacterSpeed);

         super.update();
    }
}