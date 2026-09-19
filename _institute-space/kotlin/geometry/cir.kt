class Circle(
    private val rayon: Double,
    name: String,
    color: String
) : FormeGeometrique(name, color) {
    override fun aire(): Double {
        return 3.14 * rayon * rayon
    }

    override fun show() {
        print("""
          name: $name
          color: $color
          aire: ${aire()}

        """)
    }
}