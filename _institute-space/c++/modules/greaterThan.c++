# include <iostream>

using namespace std;

int main () {
    int x, y, z;
    string max, min;
    cout << "Enter x = ";
    cin >> x;
    cout << "Enter y = ";
    cin >> y;
    cout << "Enter z = ";
    cin >> z;
    max = " est maximum";
    min = " est minimum";

    if (x < y) {
        if (x < z) {
            cout << x << min;
            if (y > z) {
                cout << y << max;
            } else {
                cout << z << max;
            }
        } else {
            cout << z << min;
            if (x > y) {
                cout << x << max;
            } else {
                cout << y << max;
            }
        }
    } else {
        if (x < z) {
            cout << x << min << endl;
            cout << z << max;
        } else {
            cout << z << min << endl;
            cout << x << max;
        }
    }
}