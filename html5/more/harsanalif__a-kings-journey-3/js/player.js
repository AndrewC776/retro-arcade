
var Player = {};

Player.life = 250;
Player.key = 0;
Player.mainKey = 0;
Player.posX = 15;
Player.posY = 18;
Player.tempMap = [];
Player.tempItem = [];

Player.init = function()
{
	this.life = 250;
	this.key = 0;
	this.mainKey = 0;
	this.posX = 15;
	this.posY = 18;
	this.tempMap = [];
	this.tempItem = [];
	
	for(var i=0;i<map.length;i++)
	{
		this.tempMap.push(map[i]);
	}
	
	for(var i=0;i<item.length;i++)
	{
		this.tempItem.push(item[i]);
	}
}
Player.init();