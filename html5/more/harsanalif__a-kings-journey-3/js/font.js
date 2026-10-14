
var fontWidth = 16;
var fontHeight = 16;

var Font = {};

Font.letterArr = [' ', '!', '\"', '#', '$', '%', '&', '\'', '(', ')', '_', '+', ',', '-', '.', '/',
				  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
				  '@', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
				  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '[', '\\', ']', -1, -1];

Font.drawText = function(text, posX, posY)
{
	for(var i=0;i<text.length;i++)
	{
		var tilePos = this.getCoordinate(text.charAt(i));
		ctx.drawImage(font, tilePos.x, tilePos.y, fontWidth, fontHeight, posX+(fontWidth*i), posY, fontWidth, fontHeight);
	}
}

Font.getCoordinate = function(letter)
{
	var idx = this.letterArr.indexOf(letter);
	
	var posX = idx%16 * fontWidth;
	var posY = Math.floor(idx/16) * fontHeight;
	
	return {x:posX, y:posY};
}