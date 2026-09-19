abstract class FormeGeometrique(
    protected val name: String,
    protected val color: String
) {
    protected abstract fun aire(): Double
    abstract fun show()
}

fun main() {
    val rec = Rectangle(20.0, 20.0, "Rec", "Red")
    rec.show()

    val cir = Circle(10.0, "Cir", "Cyan")
    cir.show()

    val tri = Triangle(5.0, 5.0, 5.0, "Tri", "Teal")
    tri.show()
}
