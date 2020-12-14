var canvas = document.getElementById("canvas_main");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var xcenter = width / 2;
var ycenter = height / 2;
var xquarter = width / 4;
var yquarter = height / 4;
var xeight = width / 8;
var yeight = height / 8;

var nodeSize = 30;

function draw_circle(ctx, x, y, r, c, bc)
{
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = c;
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = bc;
	ctx.stroke();
}
function draw_line(ctx, x1, y1, x2, y2, c)
{
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#000000";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}
function draw_text(ctx, v, x, y, s, c)
{
	ctx.font = s + "px Arial";
	ctx.fillStyle = c;
	ctx.textAlign = "center";
	ctx.fillText(v, x, y);
}
function clear_text(ctx, c)
{
	ctx.fillStyle = c;
	ctx.fillRect(0, 0, width, ycenter-yquarter-yeight+4);
	draw_border(ctx, width, height, "black");
}
function draw_border(ctx, width, height, c)
{
	ctx.strokeStyle = c;
	ctx.lineWidth = 5;
	ctx.strokeRect(0, 0, width, height);
}
function draw_clear(ctx, width, height, c)
{
	ctx.fillStyle = c;
	ctx.fillRect(0, 0, width, height);
}

class Node
{
	constructor(ctx, x, y, r, c)
	{
		this.context = ctx;
		this.xpos   = x;
		this.ypos   = y;
		this.size   = r;
		this.color  = c;
		this.bcolor = "black";
		this.l      = null;
		this.r      = null;
		this.u      = null;
		this.d      = null;
		this.ul     = null;
		this.ur     = null;
		this.dl     = null;
		this.dr     = null;
		this.set_color(c);
	}
	deselect()
	{
		this.bcolor = "black";
		this.set_color(this.color);
	}
	select()
	{
		this.bcolor = "blue";
		this.set_color(this.color);
	}
	is_moveable(no)
	{
		if (no == this.l  ||
		    no == this.r  ||
		    no == this.u  ||
		    no == this.d  ||
		    no == this.ul ||
		    no == this.ur ||
		    no == this.dl ||
		    no == this.dr)
		{
			return true;
		}
		return false;
	}
	attach(on, d)
	{
		if (d == "left")
		{
			this.l = on;
			on.r = this;
		}
		else if (d == "right")
		{
			this.r = on;
			on.l = this;
		}
		else if (d == "up")
		{
			this.u = on;
			on.d = this;
		}
		else if (d == "down")
		{
			this.d = on;
			on.u = this;
		}
		else if (d == "upleft")
		{
			this.ul = on;
			on.dr = this;
		}
		else if (d == "upright")
		{
			this.ur = on;
			on.dl = this;
		}
		else if (d == "downleft")
		{
			this.dl = on;
			on.ur = this;
		}
		else if (d == "downright")
		{
			this.dr = on;
			on.ul = this;
		}
		this.set_line_to_node(on, "black");
	}
	set_line_to_node(on, c)
	{
		draw_line(this.context, this.xpos, this.ypos, on.xpos, on.ypos, c);
		this.set_color(this.color);
		on.set_color(on.color);
	}
	set_color(c)
	{
		this.color = c;
		draw_circle(this.context, this.xpos, this.ypos,
			    this.size, this.color, this.bcolor);
	}
}

draw_clear(context, width, height, "#cccccc");
draw_border(context, width, height, "black");

var n1  = new Node(context, xquarter,		ycenter,		nodeSize, "gray");
var n2  = new Node(context, xquarter+xeight,	ycenter-yquarter,	nodeSize, "gray");
var n3  = new Node(context, xquarter+xeight,	ycenter,		nodeSize, "white");
var n4  = new Node(context, xquarter+xeight,	ycenter+yquarter,	nodeSize, "gray");
var n5  = new Node(context, xcenter,		ycenter-yquarter,	nodeSize, "white");
var n6  = new Node(context, xcenter,		ycenter,		nodeSize, "white");
var n7  = new Node(context, xcenter,		ycenter+yquarter,	nodeSize, "white");
var n8  = new Node(context, xcenter+xeight,	ycenter-yquarter,	nodeSize, "white");
var n9  = new Node(context, xcenter+xeight,	ycenter,		nodeSize, "white");
var n10 = new Node(context, xcenter+xeight,	ycenter+yquarter,	nodeSize, "white");
var n11 = new Node(context, xcenter+xquarter,	ycenter,		nodeSize, "yellow");

var na = [n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11];

n1.attach(n2, "upright");
n1.attach(n3, "right");
n1.attach(n4, "downright");

n3.attach(n2, "up");
n3.attach(n4, "down");
n3.attach(n6, "right");

n6.attach(n2, "upleft");
n6.attach(n4, "downleft");
n6.attach(n5, "up");
n6.attach(n7, "down");
n6.attach(n8, "upright");
n6.attach(n9, "right");
n6.attach(n10, "downright");

n5.attach(n2, "left");
n5.attach(n8, "right");

n7.attach(n4, "left");
n7.attach(n10, "right");

n9.attach(n8, "up");
n9.attach(n11, "right");
n9.attach(n10, "down");

n11.attach(n8, "upleft");
n11.attach(n10, "downleft");

var w1 = n1;
var w2 = n2;
var w3 = n4;

var wa = [w1, w2, w3];

var h = n11;

var ns = n1;

var turn = 1;

draw_text(context, "HOUNDS", xcenter, ycenter-yquarter-yeight, "54", "gray");

canvas.addEventListener("mousedown", function(e)
{
	var area = canvas.getBoundingClientRect();
	var x = Math.ceil(e.clientX - area.left);
	var y = Math.ceil(e.clientY - area.top);
	for (var i = 0; i < na.length; i++)
	{
		if (x > na[i].xpos-na[i].size && x < na[i].xpos+na[i].size && 
		    y > na[i].ypos-na[i].size && y < na[i].ypos+na[i].size)
		{
			if (turn == 0)
			{
				if (na[i] == h)
				{
					ns.deselect();
					na[i].select();
					ns = na[i];
				}
				else if (ns == h && h.is_moveable(na[i]))
				{
					ns.deselect();
					ns.set_color("white");
					h = na[i];
					h.set_color("yellow");
					turn = 1;
					clear_text(context, "#cccccc");
					draw_text(context, "HOUNDS", xcenter, ycenter-yquarter-yeight, "54", "gray");
				}
			}
			else
			{
				for (var j = 0; j < wa.length; j++)
				{
					if (na[i] == wa[j])
					{
						ns.deselect();
						na[i].select();
						ns = na[i];
					}
					else if (ns == wa[j] && wa[j].is_moveable(na[i]))
					{
						var overlap = false;
						for (var k = 0; k < wa.length; k++)
						{
							if (na[i] == wa[k])
							{
								overlap = true;
								break;
							}
						}
						if (na[i] == h) break;
						if (overlap)
						{
							ns.deselect();
							na[i].select();
							ns = na[i];
							break;
						}
						if (na[i].xpos < wa[j].xpos) break;
						ns.deselect();
						ns.set_color("white");
						wa[j] = na[i];
						wa[j].set_color("gray");
						clear_text(context, "#cccccc");
						draw_text(context, "HARE", xcenter, ycenter-yquarter-yeight, "54", "yellow");
						turn = 0;
					}
				}
			}
		}
	}
});
