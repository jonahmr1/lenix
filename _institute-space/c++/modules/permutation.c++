

# include <iostream>

using namespace std;

int x, y, p;
int main() {
    cout << "Entre la valeur x: ";
    cin >> x;
    cout << "Entre la valeur y: ";
    cin >> y;

    p = x;
    x = y;
    y = p;

    cout << "La conversation a ete valider: " << "x = " << x << " y = " << y;
    return 0;
}