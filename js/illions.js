//OPTIONS
const ILLIONS_OPTIONS = {
	prec: 4, //Significant digits [3 - 9]
	precPoint: 5, //10^10^x before simplification [6 - 9]
	long: false, //Long scale [10^6x instead of 10^(3x+3)]

	//TIER 1
	eng: true, //Uses english names for tier-1 illions + millillion.
	tam: false, //Uses Tamara's illions.

	//TIER 2
	myr: false, //Uses myrillions for decimillillion replacement.
	si: false, //Uses SI's proposed prefixes for tier-2.
}

//GLOBAL FUNCTIONS
function abbreviate(x) { return ILLIONS_FUNCTIONS.format(x) }
function standard(x) { return ILLIONS_FUNCTIONS.abb(x, 1) }
function illion(x) { return ILLIONS_FUNCTIONS.abb(x, 1, "name") + (Decimal.eq(x, 0) ? "" : "illion") }
function name(x) { return ILLIONS_FUNCTIONS.name(x) }
function english(x) { return ILLIONS_FUNCTIONS.english(x) }




//MODULE
let ILLIONS = {
	0: {
		name: {
			data: {
				o: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
				teen: ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
				t: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
			},
			format(x) {
				//SETUP
				var d = this.data

				//HTO
				var hto = ILLIONS_FUNCTIONS.HTO(x)
				var h = hto.h
				var t = hto.t
				var o = hto.o

				//FORMAT
				let r = ""
				if (h > 0) r += d.o[h] + " hundred"
				if (t > 0 || o > 0) {
					if (r) r += " "
					if (t == 1) r += d.teen[t]
					else r += d.t[t] + (t > 0 && o > 0 ? "-" : "") + d.o[o]
				}
				return r
			}
		},
		abb: {
			format(x) {
				return x
			}
		}
	},
	1: {
		name: {
			data: {
				o_s: ['thousand', 'm', 'b', 'tr', "quadr", "quint", "sext", "sept", "oct", "non"],
				o_s_t2: ['', 'un', 'du'],
				o_eng_t2: ['', 'unt', 'duet'],
				o: ['', 'un', 'duo', 'tre', 'quattour', 'quin', 'sex', 'septen', 'octo', 'novem'],

				t: ['', 'dec', 'vigint', 'trigint', 'quadragint', 'quinquagint', 'sexagint', 'septuagint', 'octogint', 'nonagint'],
				h: ['', 'cent', 'ducent', 'tricent', 'quadragent', 'quinquagent', 'sexagent', 'septuagent', 'octogent', 'nonagent'],
				h_eng: ['', 'cent', 'ducent', 'trucent', 'quadringent', 'quingent', 'sescent', 'septingent', 'octingent', 'nongent']
			},
			format(x, ty = "") {
				//SETUP
				var d = this.data
				var dh = d[ILLIONS_OPTIONS.eng ? "h_eng" : "h"]

				//HTO
				var hto = ILLIONS_FUNCTIONS.HTO(x)
				var h = hto.h
				var t = hto.t
				var o = hto.o

				var end = ty == "mul" ? "i" : ""
				if (x == 0 && ty == "") return d.o_s[0]
				if (x <= 2 && ty != "") return d[ty == "add" && ILLIONS_OPTIONS.eng ? "o_eng_t2" : "o_s_t2"][x] + (ty == "mul" ? "" : end)
				if (x < 10) return d.o_s[x] + end
				if (ILLIONS_OPTIONS.tam && h >= 1) {
					var r = ""
					if (h > 1 || x == 100) r += dh[h] + "i"
					r += d.t[t] + this.combineTen(t, h) + d.o[o] + dh[1] + end
					return r
				}
				if (ILLIONS_OPTIONS.eng && h > 0 && o == 3) return dh[h] + "ret" + end
				if (ty == "mul" && t > 0 && h == 0) end = this.combineTen(t, 1)
				return d.o[o] + d.t[t] + this.combineTen(t, h) + dh[h] + end
			},
			combineTen(t, h) {
				if (t == 0 || h == 0) return ""
				if (t >= 3 && ILLIONS_OPTIONS.eng) return "a"
				return "i"
			}
		},
		abb: {
			data: {
				o_s: ['K', 'M', 'B'],
				o: ["", "U", "D", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N"],
				t: ["", "D", "V", "TR", "QU", "QI", "SX", "SP", "OC", "NO"],
				h: ["", "CE", "DU", "TE", "QR", "QN", "SE", "ST", "OT", "NN"]
			},
			format(x, ty = "") {
				//SETUP
				var d = this.data

				//HTO
				var hto = ILLIONS_FUNCTIONS.HTO(x)
				var h = hto.h
				var t = hto.t
				var o = hto.o

				if (x < 3 && ty == "") return d.o_s[x]
				if (ILLIONS_OPTIONS.tam && h >= 1) {
					var r = ""
					if (h > 1) r += d.h[h]
					r += d.t[t] + d.o[o] + d.h[1]
					return r
				}
				return d.o[o] + d.t[t] + d.h[h]
			}
		}
	},
	2: {
		name: {
			data: {
				eng: {
					o_s: ["", "mill", "micr", "nan", "pic", "fem", "att", "zept", "yoct", "xenn"],
					o: ["", "me", "due", "trio", "tetre", "pente", "hexe", "hepte", "octe", "enne"],
					te: ["vec", "mec", "duec", "trec", "tetrec", "pentec", "hexec", "heptec", "octec", "ennec"],
					d: ["", "", "do", "tria", "tetra", "penta", "hexa", "hepta", "octa", "ennea"],	
				},
				tam: [
					"", "mo", "do", "tro", "tetro", "pento", "hexo", "hepto", "octo", "enno",
				]
			},
			format(x, ty = "") {
				//SETUP
				var d = this.data[ILLIONS_OPTIONS.tam ? "tam" : "eng"]

				//HTO
				var hto = ILLIONS_FUNCTIONS.HTO(x)
				var h = hto.h
				var t = hto.t
				var o = hto.o

				//MAIN
				var r = ""
				if (ILLIONS_OPTIONS.tam) {
					//TAMARA
					if (h > 0) {
						if (h >= 2) r = d[h]
						r += "conto"
					}
					if (t > 0) {
						if (t >= 2) r += d[t]
						r += "deco"
					}
					r += d[o] + "n"
					if (ty == "end") r += "o"
				} else if (ILLIONS_OPTIONS.si && (x == 9 || x == 10)) {
					//SI
					r = ["quect", "ront"][x - 9]
				} else {
					//BOWERS
					if (t == 1) r += d.te[o]
					else if (o > 0) {
						if (x < 10) r = d.o_s[o]
						else r = d.o[o]
					}
					if (t >= 2) {
						if (t == 2) r += "icos"
						else r += d.d[t] + "cont"
					}
					if (h > 0) {
						if (t > 0) r += "e"
						r += d.d[h] + "hect"
					}

					if (ty == "end") {
						if (x == 1) r += "i"
						if (x >= 2) r += "o"
						if (x >= 1) r += "-"
					} else if (ILLIONS_OPTIONS.eng && x == 1) r += "in"
				}
				return r
			}
		},
		abb: {
			data: {
				eng: {
					o_s: ["", "Mil", "Mic", "Na", "Pi", "Fm", "At", "Zp", "Yc", "Xn"],
					o: ["", "Mc", "Due", "Tre", "Tte", "Pn", "Hx", "Hp", "Oct", "En"],
					t: ["", "C", "Ico", "Tc", "Ttc", "Pc", "Hc", "Hpc", "Occ", "Ec"],
					h: ["", "Hc", "Dh", "Th", "Tth", "Ph", "Hh", "Hph", "Oh", "Eh"]
				},
				tam: ["", "M", "D", "Tr", "Te", "Pe", "He", "Hp", "Oc", "En"],
			},
			format(x, ty = "") {
				//SETUP
				var d = this.data[ILLIONS_OPTIONS.tam ? "tam" : "eng"]

				//HTO
				var hto = ILLIONS_FUNCTIONS.HTO(x)
				var h = hto.h
				var t = hto.t
				var o = hto.o

				//MAIN
				var r = ""
				if (ILLIONS_OPTIONS.tam) {
					//TAMARA
					if (h > 0) {
						if (h >= 2) r = d[h] + "c"
						else r = "Co"
					}
					if (t > 0) {
						if (t >= 2) r += d[t] + "d"
						else r += "De"
					}
					r += d[o] + "n"
				} else if (ILLIONS_OPTIONS.si && (x == 9 || x == 10)) {
					//SI
					r = ["Qu", "Ro"][x - 9]
				} else {
					//BOWERS
					if (x < 10) return d.o_s[x]
					else {
						if (t == 1 && o == 0) r += "Vc"
						else r += d.o[o] + d.t[t]
						r += d.h[h]
					}
				}
				if (x >= 1 && ty == "end") r += "-"
				return r
			}
		}
	}
}

let ILLIONS_FUNCTIONS = {
	HTO(x) {
		return {
			h: Math.floor(x / 100),
			t: Math.floor(x / 10) % 10,
			o: x % 10
		}
	},

	myrBlock(x, ty, k = "abb") {
		var d = {
			abb: "My",
			abb_end: "My",

			name: "myr",
			name_end: "myrio-"
		}

		//HTO
		var hto = ILLIONS_FUNCTIONS.HTO(x)
		var h = hto.h
		var t = hto.t
		var o = hto.o
		var r = ""
		if (t + h > 0) r += this.safeAbb(h * 10 + t, 1, "mul", k) + d[k + (o > 0 || ty == "end" ? "_end" : "")]
		if (o > 0) r += this.safeAbb(o, 1, "mul", k) + this.safeAbb(1, 2, ty, k)
		return r
	},

	safeAbb(x, t, ty, k = "abb") {
		if (x == 1 && ty == "mul") return ""
		if (x == 0 && (t > 1 || ty != "")) return ""
		if (ILLIONS[t] === undefined) {
			console.error("[illions.js] Tier " + t + " abbreviations aren't supported.")
			return "?"
		}
		if (x >= 1e3) return this.abb(x, t, k)
		return ILLIONS[t][k].format(x, ty)
	},
	abb(x, t = 1, k = "abb") {
		x = new Decimal(x)

		var e = x.e
		if (e == 1/0) return this.abb(x.log10().div(3), t + 1, k)

		var ee = Math.floor(Math.max(Math.log10(x.e), 0))
		var mul = Math.pow(10, Math.max(Math.min(ILLIONS_OPTIONS.precPoint - ee, ILLIONS_OPTIONS.prec) - 1, 0))
		var m = Math.floor((x.m + Math.pow(10, ee - 12)) * mul) / mul
		if (m >= 10) {
			m /= 10
			e++
		}
		if (ee >= ILLIONS_OPTIONS.precPoint) {
			if (t == 1 && k == "name") return this.abb(Math.floor(e / 3), t + 1, k) + "illion"
			return this.abb(Math.floor(e / 3), t + 1, k)
		}

		var r = ""
		var e3 = Math.floor(e / 3)
		var end = 0
		m = Math.round(m * Math.pow(10, 6)) * Math.pow(10, e - e3 * 3)
		for (var p = 0; p < 3; p++) {
			var i = Math.floor(m / Math.pow(10, 6 - 3 * p)) % 1e3
			if (e3 - p < 0) continue
			if (e3 == 0 || i > 0) {
				end = e3 - p
				if (end == 1 && t == 1 && ILLIONS_OPTIONS.myr) r += this.myrBlock(i, m % Math.pow(10, 6 - 3 * p) == 0 ? "" : "end", k)
				else {
					if (end == 0 || i > 1) r += this.safeAbb(i, t, end > 0 ? "mul" : e3 > 0 ? "add" : "", k)
					if (end > 0) r += this.safeAbb(end, t + 1, p == 2 || m % Math.pow(10, 6 - 3 * p) == 0 ? "" : "end", k)
				}
			}
		}
		return r
	},

	format(x, k) {
		x = new Decimal(x)
		if (x.lt(1)) return x.toFixed(2)

		var e = x.e
		var ill = (e >= 6 && k == "name" ? "illion" : "")
		if (e == 1/0) return this.abb(x.log10().div(ILLIONS_OPTIONS.long ? 6 : 3), 1, k) + ill

		var e3 = Math.floor(e / 3)
		var e3_rel = ILLIONS_OPTIONS.long ? Math.floor(e3 / 2) : e3 - 1
		if (e >= Math.pow(10, ILLIONS_OPTIONS.precPoint)) return this.abb(e3_rel, 1, k) + ill

		var m = (x.m * Math.pow(10, e - e3 * 3)).toFixed(2)
		if (m >= 1e3) {
			m = "1.00"
			e++
			e3++
			e3_rel = ILLIONS_OPTIONS.long ? Math.floor(e3 / 2) : e3 - 1
		}

		if (ILLIONS_OPTIONS.long && e3_rel > 0) return m +
			(e3_rel > 0 ? "" + this.abb(e3_rel, 1, k) : "") +
			(k == "name" ? "illi" + (e3 % 2 == 1 ? "ard" : "on") : e3 % 2 == 1 ? "rd" : "")
		return m +
			(e3 > 0 ? "" + this.abb(e3_rel, 1, k) : "") +
			ill
	},
	name: (x) => ILLIONS_FUNCTIONS.format(x, "name")
}

//END OF ILLIONS.JS
/*console.log(
	`
	illions.js: v2.01
		By Aarex Tiaokhiao, 2021
		GEN. VI-Mu: Lightning-Thornus [Tria-Respeccus III]
		Epsilon Stage
	A program that generates -illion names and abbrevations up to currently killillion.

	[DECIMAL LIBRARY IS REQUIRED] https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/logarithmica_numerus_lite.js
	
	See about illions.js at: https://github.com/aarextiaokhiao/illions.js
	Feel free to use it at: https://github.com/aarextiaokhiao/illions.js/blob/main/illions.js

	Type 'illion(31415926535)' in your developer console to see an example!
	`
)*/
