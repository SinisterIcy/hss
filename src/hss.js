class Element {
	
	input_number
	output_number
		
	operation

	inputs = []
	outputs = []

	constructor(input_number, output_number, operation) {
		this.input_number = input_number
		this.output_number = output_number
		this.operation = operation
	}
	
	run(inputs) {
		if(typeof this.operation === 'function') {
			this.outputs = this.operation(inputs)
		}
		else {  }
		return this.outputs
	}
}

Gates = {
	nand: new Element(2, 1, (inputs) => {
		if(inputs[0] && inputs[1]) { return 0; }
		return 1;
	}),
}

vertices = { }

gates = {
	'nand': [Gates.nand, 2, 1]
}

links = { }

check_vertex = (vertex) => {
	if(!vertices.hasOwnProperty(vertex)) {
		console.log('ERROR - vertex does not exist')
	}
}

check_gate = (gate) => {
	if(!gates.hasOwnProperty(gate)) {
		console.log('ERROR - gate does not exist')
	}
}

auto_create_links_lst = (obj) => {
	if(!links[obj]) {
		links[obj] = []
	}
}

link = (gate, inputs, outputs) => {
	inputs.forEach(input => {
		check_vertex(input)
		check_gate(gate)
		auto_create_links_lst(input)
		links[input].push(gate)
	})
	outputs.forEach(output => {
		check_vertex(output)
		check_gate(gate)
		auto_create_links_lst(gate)
		links[gate].push(output)
	})
}

get_back_linked_vertices = (element) => {
	backlinks = []
	Object.keys(vertices).forEach(vertex => {
		if(links[vertex]) {
			links[vertex].forEach(link => {
				if(link === element) {
					backlinks.push(vertex)
				}
			})
		}
	})
	return backlinks
}

lst_to_values = (lst) => {
	values = []
	lst.forEach(element => {
		values.push(vertices[element])
	})
	return values
}

update = (vertex, value=-1) => {
	if(value === -1) { value = vertices[vertex] }
	value = parseInt(value)
	vertices[vertex] = value
	if(links[vertex]) {
		links[vertex].forEach(link => {
			if(link in gates) {
				vertices[links[link]] = gates[link][0].run(lst_to_values(get_back_linked_vertices(link)))
			}
		})
	}
}

shell = text => {
	args = text.split(' ')
	if(args[0] === 'vertex') {
		vertices[args[1]] = parseInt(args[2]) ?? 0
	}
	else if(args[0] === 'link') {
		if(args.length == 2 + gates[args[1]][1] + gates[args[1]][2]) {
			link(args[1], args.slice(2, 2 + gates[args[1]][1]), args.slice(2 + gates[args[1]][1]))
		}
	}
	else if(args[0] === 'update') {
		update(args[1], args[2])
	}
}

log = () => {
	console.log(vertices)
	console.log(links)
}

module.exports = {
	shell,
	log,
}