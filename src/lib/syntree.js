// By Miles Shang <mail@mshang.ca>
// MIT license
// import { log } from "console";
import Canvas2Image from "./canvas2image";

var debug = true;
var margin = 15; // Number of pixels from tree to edge on each side.
var padding_above_text = 6; // Lines will end this many pixels above text.
var padding_below_text = 6;

function Node() {
	this.value = null; // giá trị của nút
	this.step = null; // Horizontal distance between children.
	this.draw_triangle = null;// true ? false
	this.label = null; // Head of movement.
	this.tail = null; // Tail of movement.
	this.max_y = null; // Distance of the descendent of this node that is farthest from root.
	this.children = new Array();
	this.has_children;
	this.first = null;
	this.last = null;
	this.parent = null;
	this.next = null;
	this.previous = null;
	this.x = null; // Where the node will eventually be drawn.
	this.y = null;
	this.head_chain = null;
	this.tail_chain = null;
	this.starred = null;
}

Node.prototype.set_siblings = function (parent) {
	for (var i = 0; i < this.children.length; i++)
		this.children[i].set_siblings(this);

	this.has_children = (this.children.length > 0);
	this.parent = parent;

	if (this.has_children) {
		this.first = this.children[0];
		this.last = this.children[this.children.length - 1];
	}

	for (var i = 0; i < this.children.length - 1; i++)
		this.children[i].next = this.children[i + 1];

	for (var i = 1; i < this.children.length; i++)
		this.children[i].previous = this.children[i - 1];
}

// Node.prototype.check_triangle = function () {
// 	if (this && this.starred) {
// 		// Safe to access node.starred
// 		this.draw_triangle = false;
// 		if ((!this.has_children) && (this.parent.starred))
// 			this.draw_triangle = true;

// 		for (var child = this.first; child != null; child = child.next)
// 			child.check_triangle();
// 	} else {
// 		console.error("Node or starred property is null");
// 	}

// }
Node.prototype.check_triangle = function() {
	this.draw_triangle = 0;
	if ((!this.has_children) && (this.parent.starred))
		this.draw_triangle = 1;

	for (var child = this.first; child != null; child = child.next)
		child.check_triangle();
}

Node.prototype.set_width = function (ctx, vert_space, hor_space, term_font, nonterm_font) {
	ctx.font = term_font;
	if (this.has_children)
		ctx.font = nonterm_font;

	var val_width = ctx.measureText(this.value).width;

	for (var child = this.first; child != null; child = child.next)
		child.set_width(ctx, vert_space, hor_space, term_font, nonterm_font);

	if (!this.has_children) {
		this.left_width = val_width / 2;
		this.right_width = val_width / 2;
		return;
	}

	// Figure out how wide apart the children should be placed.
	// The spacing between them should be equal.
	this.step = 0;
	for (var child = this.first; (child != null) && (child.next != null); child = child.next) {
		var space = child.right_width + hor_space + child.next.left_width;
		this.step = Math.max(this.step, space);
	}

	this.left_width = 0.0;
	this.right_width = 0.0;

	if (this.has_children) {
		var sub = ((this.children.length - 1) / 2) * this.step;
		this.left_width = sub + this.first.left_width;
		this.right_width = sub + this.last.right_width;
	}

	this.left_width = Math.max(this.left_width, val_width / 2);
	this.right_width = Math.max(this.right_width, val_width / 2);

}

Node.prototype.find_height = function () {
	this.max_y = this.y;
	for (var child = this.first; child != null; child = child.next)
		this.max_y = Math.max(this.max_y, child.find_height());
	return this.max_y;
}

Node.prototype.align_leaf_nodes = function () {
	let farthestLeafY = null;

	function find_farthest_leaf_y(node) {
		if (!node.has_children) {
			// Nếu đây là nút lá, cập nhật farthestLeafY nếu nó xa hơn nút lá hiện tại
			if (farthestLeafY === null || node.y > farthestLeafY) {
				farthestLeafY = node.y;
			}
		} else {
			for (let child = node.first; child != null; child = child.next) {
				find_farthest_leaf_y(child);  // Tiếp tục duyệt cây để tìm nút lá xa nhất
			}
		}
	}

	function set_leaf_y(node) {
		if (!node.has_children) {
			node.y = farthestLeafY;  // Đặt lại vị trí y cho các nút lá
		} else {
			for (let child = node.first; child != null; child = child.next) {
				set_leaf_y(child);
			}
		}
	}

	// Tìm giá trị y của nút lá xa nhất
	find_farthest_leaf_y(this);
	// Cập nhật vị trí y của tất cả các nút lá
	set_leaf_y(this);
};


Node.prototype.assign_location = function (x, y, font_size, term_lines) {
	// floor + 0.5 for antialiasing
	this.x = Math.floor(x) + 0.5;
	this.y = Math.floor(y) + 0.5;

	if (this.has_children) {
		var left_start = x - (this.step) * ((this.children.length - 1) / 2);
		for (var i = 0; i < this.children.length; i++)
			this.children[i].assign_location(left_start + i * (this.step), y + 50, font_size, term_lines);
	} else {
		if ((this.parent) && (!term_lines) && (this.parent.children.length == 1) && (!this.draw_triangle))
			this.y = this.parent.y + padding_above_text + padding_below_text + font_size;
	}
}

Node.prototype.draw = function (ctx, font_size, term_font, nonterm_font, color, term_lines) {
	ctx.font = term_font;
	if (this.has_children)
		ctx.font = nonterm_font;

	ctx.fillStyle = "brown";
	if (color) {
		ctx.fillStyle = "green";
		if (this.has_children)
			ctx.fillStyle = "#C7262E";
	}

	ctx.fillText(this.value, this.x, this.y);
	for (var child = this.first; child != null; child = child.next)
		child.draw(ctx, font_size, term_font, nonterm_font, color, term_lines);

	if (!this.parent) return;

	if (this.draw_triangle) {
		ctx.moveTo(this.parent.x, this.parent.y + padding_below_text);
		ctx.lineTo(this.x - this.left_width, this.y - font_size - padding_above_text);
		ctx.lineTo(this.x + this.right_width, this.y - font_size - padding_above_text);
		ctx.lineTo(this.parent.x, this.parent.y + padding_below_text);
		ctx.stroke();
		return;
	}
	console.log('this.draw_triangle', this.value, this.draw_triangle)
	if ((!this.has_children) && (!term_lines) && (this.parent.children.length == 1)) return;

	ctx.moveTo(this.parent.x, this.parent.y + padding_below_text);
	ctx.lineTo(this.x, this.y - font_size - padding_above_text);
	ctx.stroke();
}

Node.prototype.find_head = function (label) {
	for (var child = this.first; child != null; child = child.next) {
		var res = child.find_head(label);
		if (res != null) return res;
	}

	if (this.label == label) return this;
	return null;
}

Node.prototype.find_movement = function (mlarr, root) {
	for (var child = this.first; child != null; child = child.next)
		child.find_movement(mlarr, root);

	if (this.tail != null) {
		var m = new MovementLine;
		m.tail = this;
		m.head = root.find_head(this.tail);
		mlarr.push(m);
	}
}

Node.prototype.reset_chains = function () {
	this.head_chain = null;
	this.tail_chain = null;

	for (var child = this.first; child != null; child = child.next)
		child.reset_chains();
}

Node.prototype.find_intervening_height = function (leftwards) {
	var max_y = this.y;

	var n = this;
	while (true) {
		if (leftwards) { n = n.previous; } else { n = n.next; }
		if (!n) break;
		if ((n.head_chain) || (n.tail_chain)) return max_y;
		max_y = Math.max(max_y, n.max_y);
	}

	max_y = Math.max(max_y,
		this.parent.find_intervening_height(leftwards));
	return max_y;
}

function MovementLine() {
	this.head = null;
	this.tail = null;
	this.lca = null;
	this.dest_x = null;
	this.dest_y = null;
	this.bottom_y = null;
	this.max_y = null;
	this.should_draw = null;
	this.leftwards = null;
}

MovementLine.prototype.set_up = function () {
	this.should_draw = 0;
	if ((this.tail == null) || (this.head == null)) return;

	// Check to see if head is parent of tail,
	if (!this.check_head()) return;

	// Find the last common ancestor.
	this.find_lca();
	if (this.lca == null) return;

	// Find out the greatest intervening height.
	this.find_intervening_height();

	this.dest_x = this.head.x;
	this.dest_y = this.head.max_y;
	this.bottom_y = this.max_y + 50;
	this.should_draw = 1;
	return;
}

MovementLine.prototype.check_head = function () {
	var n = this.tail; // một node
	n.tail_chain = 1; // đánh dấu đã duyệt qua và là một phần tử nối từ nút tail
	while (n.parent != null) { // duyệt cho đến gốc
		n = n.parent;
		if (n == this.head) return 0;
		n.tail_chain = 1;
	}
	return 1;
}

MovementLine.prototype.find_lca = function () {
	var n = this.head; // một Node
	n.head_chain = 1; // đánh dấu đã duyệt qua và là một phần tử nối từ nút head
	this.lca = null; //chuẩn bị để tìm tổ tiên chung thấp nhất giữa nút đầu và nút đuôi
	while (n.parent != null) { // duyệt cho đến gốc
		n = n.parent; // di chuyển lên nút trên. cha của nút hiện tại
		n.head_chain = 1; // đánh dấu đã duyệt qua và là một phần tử nối từ nút head
		if (n.tail_chain) { //Kiểm tra xem tổ tiên có cờ tail_chain không. Nếu có, cập nhật tổ tiên này làm LCA và dừng tìm kiếm.
			this.lca = n;
			break;
		}
	}
}

MovementLine.prototype.find_intervening_height = function () {
	for (var child = this.lca.first; child != null; child = child.next) {
		if ((child.head_chain) || (child.tail_chain)) {
			this.leftwards = false;
			if (child.head_chain) this.leftwards = true;
			break;
		}
	}

	this.max_y = Math.max(this.tail.find_intervening_height(this.leftwards),
		this.head.find_intervening_height(!this.leftwards),
		this.head.max_y);
}

MovementLine.prototype.draw = function (ctx) {
	var tail_x = this.tail.x + 3;
	this.dest_x -= 3;
	if (this.leftwards) {
		tail_x -= 6;
		this.dest_x += 6;
	}

	ctx.moveTo(tail_x, this.tail.y + padding_below_text);
	ctx.quadraticCurveTo(tail_x, this.bottom_y, (tail_x + this.dest_x) / 2, this.bottom_y);
	ctx.quadraticCurveTo(this.dest_x, this.bottom_y, this.dest_x, this.dest_y + padding_below_text);
	ctx.stroke();
	// Arrowhead
	ctx.beginPath();
	ctx.lineTo(this.dest_x + 3, this.dest_y + padding_below_text + 10);
	ctx.lineTo(this.dest_x - 3, this.dest_y + padding_below_text + 10);
	ctx.lineTo(this.dest_x, this.dest_y + padding_below_text);
	ctx.closePath();
	ctx.fillStyle = "#000000";
	ctx.fill();
}

export default function go(str, font_size, term_font, nonterm_font, vert_space, hor_space, color, term_lines) {
	// Clean up the string
	str = str.replace(/^\s+/, "");
	var open = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == "[") open++;
		if (str[i] == "]") open--;
	}
	// open = 0, số lượng dấu được cân bằng
	while (open < 0) { // dấu mở ít hơn đóng
		str = "[" + str;
		open++;
	}
	while (open > 0) { // đóng ít hơn mở
		str = str + "]";
		open--;
	}

	var root = parse(str); // parse(str): Node(), phân tích chuỗi và tạo thành Node
	root.set_siblings(null);

	var canvas;
	var ctx;

	try {
		// Make a new canvas. Required for IE compatability.
		canvas = document.createElement("canvas");
		ctx = canvas.getContext('2d');
	} catch (err) {
		throw "canvas";
	}

	// Find out dimensions of the tree.
	root.set_width(ctx, vert_space, hor_space, term_font, nonterm_font);
	root.assign_location(0, 0, font_size, term_lines);
	root.find_height();
	root.align_leaf_nodes();

	var movement_lines = new Array();
	root.find_movement(movement_lines, root);
	for (var i = 0; i < movement_lines.length; i++) {
		root.reset_chains();
		movement_lines[i].set_up();
	}

	// Set up the canvas.
	var width = root.left_width + root.right_width + 2 * margin;
	var height = root.max_y + font_size + 2 * margin;
	// Problem: movement lines may protrude from bottom.
	for (var i = 0; i < movement_lines.length; i++)
		if (movement_lines[i].max_y == root.max_y) {
			height += vert_space; break;
		}

	canvas.id = "canvas";
	canvas.width = width;
	canvas.height = height;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.textAlign = "center";
	var x_shift = Math.floor(root.left_width + margin);
	var y_shift = Math.floor(font_size + margin);
	ctx.translate(x_shift, y_shift);
	root.check_triangle();
	console.log('root.check_triangle(), ', root.check_triangle())

	root.draw(ctx, font_size, term_font, nonterm_font, color, term_lines);
	for (var i = 0; i < movement_lines.length; i++)
		if (movement_lines[i].should_draw) movement_lines[i].draw(ctx);

	// Swap out the image
	return Canvas2Image.saveAsPNG(canvas, true);
}

function subscriptify(in_str) {
	var out_str = "";
	for (var i = 0; i < in_str.length; ++i) {
		switch (in_str[i]) {
			case "0": out_str = out_str + "₀"; break;
			case "1": out_str = out_str + "₁"; break;
			case "2": out_str = out_str + "₂"; break;
			case "3": out_str = out_str + "₃"; break;
			case "4": out_str = out_str + "₄"; break;
			case "5": out_str = out_str + "₅"; break;
			case "6": out_str = out_str + "₆"; break;
			case "7": out_str = out_str + "₇"; break;
			case "8": out_str = out_str + "₈"; break;
			case "9": out_str = out_str + "₉"; break;
		}
	}
	return out_str;
}

function parse(str) {
	var n = new Node();

	if (str[0] != "[") { // Text node
		// Nếu chuỗi không bắt đầu bằng dấu ngoặc vuông, đây là một nút văn bản.
		// Nếu có thông tin di chuyển trong dạng <X> trong chuỗi, lưu thông tin vào thuộc tính `tail` của nút
		// Đồng thời, loại bỏ các khoảng trắng xung quanh <X>

		str = str.replace(/\s*<(\w+)>\s*/,
			function (match, tail) {
				n.tail = tail;
				return " ";
			});
		str = str.replace(/^\s+/, "");
		str = str.replace(/\s+$/, "");
		n.value = str;
		return n;
	}
	//"[NP [N Alice] and [N Bob]]" 
	var i = 1;
	while ((str[i] != " ") && (str[i] != "[") && (str[i] != "]")) i++;
	// nếu str[i] không phải là " ", [, ] => i++
	// i = 3 tại thời điểm này, str[i] = " "
	n.value = str.substr(1, i - 1) // 'NP'
	// Lấy giá trị của nút từ ký tự thứ hai đến trước ký tự `i`, loại bỏ dấu ngoặc vuông ở đầu.
	console.log('n.value ', n.value)
	n.value = n.value.replace(/\^/,
		function () {
			n.starred = true;
			
			return "";
		});
	console.log('n.value ', n.value)
	console.log('n.starred ', n.starred)

	// Nếu giá trị của nút chứa ký tự '^', loại bỏ ký tự này và đánh dấu nút với thuộc tính `starred`

	n.value = n.value.replace(/_(\w+)$/,
		function (match, label) {
			n.label = label;
			if (n.label.search(/^\d+$/) != -1)
				return subscriptify(n.label);
			return "";
		});
	// Nếu giá trị của nút kết thúc bằng '_<label>', lưu `<label>` vào thuộc tính `label`
	// Nếu `<label>` là số, chuyển nó thành dạng chỉ số

	//"[NP [N Alice] and [N Bob]]" 

	while (str[i] == " ") i++; // bỏ qua khoảng trắng và di chuyển con trỏ i đến ký tự khác khoảng trắng
	// i = 4, str[i] = "["
	if (str[i] != "]") {
		var level = 1; // lưu cấp độ lồng nhau của []
		var start = i; // lưu vị trí bắt đầu của chuỗi con của str, theo chuỗi đã ví dụ thì vị trí hiện tại là 4
		for (; i < str.length; i++) { // duyệt từ vị trí 4
			var temp = level; // lưu lại trước khi thay đổi
			if (str[i] == "[") level++; // mức độ lồng nhau mới bắt đầu, tại vị trí 4 là "["
			if (str[i] == "]") level--; // kết thúc một mức độ lồng nhau
			if (((temp == 1) && (level == 2)) || ((temp == 1) && (level == 0))) {
				// kiểm tra xem ban đầu level = 1, sau đó = 2 hoặc = 0
				// Kiểm tra mức độ lồng nhau khi gặp dấu ngoặc vuông mở hoặc đóng
				// Cập nhật danh sách con khi một mức độ lồng nhau bắt đầu hoặc kết thúc
				if (str.substring(start, i).search(/[^\s]/) > -1)
					// kiểm tra chuỗi con từ start = 4 đến i =  có chứa ký tự không là khoảng trắng? nếu có thì phân tích cú pháp và push vào children
					n.children.push(parse(str.substring(start, i)));
				// Phân tích cú pháp đoạn chuỗi từ `start` đến `i` và thêm nó như một node con của nút hiện tại

				start = i; // cập nhật vị trí start
			}
			if ((temp == 2) && (level == 1)) {
				n.children.push(parse(str.substring(start, i + 1)));
				// Phân tích cú pháp đoạn chuỗi từ `start` đến `i+1` và thêm nó như một node con của nút hiện tại
				start = i + 1;
			}
		}
	}
	return n;
}