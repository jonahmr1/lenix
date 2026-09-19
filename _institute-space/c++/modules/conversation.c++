# include <iostream>

using namespace std;

int x, y;
int main() {
    cout << "Entre la valeur x: ";
    cin >> x;
    cout << "Entre la valeur y: ";
    cin >> y;

    swap(x, y); 
    cout << "La conversation a ete valider: " << "x = " << x << " y = " << y;

    return 0;
}