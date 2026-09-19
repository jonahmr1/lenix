class Rectangle(
    private val long: Double,
    private val larg: Double,
    name: String,
    color: String
) : FormeGeometrique(name, color) {
    override fun aire(): Double {
        return long * larg
    }

    override fun show() {
        print("""
          name: $name
          color: $color
          aire: ${aire()}

        """)
    }
}