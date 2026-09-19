class Triangle(
    private val coteA: Double,
    private val coteB: Double,
    private val coteC: Double,
    name: String,
    color: String
) : FormeGeometrique(name, color) {
    override fun aire(): Double {
        // half perimeter
        val s = (coteA + coteB + coteC) / 2.0
        // √(s(s-a)(s-b)(s-c))
        // sqrt: square root
        return Math.sqrt(s * (s - coteA) * (s - coteB) * (s - coteC))
        // optional: round it for a precise output
    }

    override fun show() {
        print("""
          name: $name
          color: $color
          aire: ${aire()}
        """)
    }
}