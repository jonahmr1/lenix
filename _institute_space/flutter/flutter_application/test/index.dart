import 'package:flutter/material.dart';

List<int> notes = [12, 15, 8, 17, 10];
List<String> fruits = ['Apple', 'Banana', 'Orange'];

void A() {
  print(notes);
  print('Length = ${notes.length}');
  print('First = ${notes.first}');
  print('Last = ${notes.last}');
}

void B() {
  int value = 0;
  for (int note in notes) {
    print('Note = ${note}');
    value = value + note;
  }
  print('Value = ${value}');

  double average = value / notes.length;
  print('Average = ${average}');
}

void C() {
  print('Contains Banana: ${fruits.contains('Banana')}');
  print('Orange index: ${fruits.indexOf('Orange')}');
  print('List: ${fruits.join(', ')}');
  print('Contains Kiwi: ${fruits.contains('Kiwi')}');
}



void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({ super.key });

  @override
  Widget build(BuildContext context) {
    final List<String> products = ['bread', 'milk', 'eggs', 'tomato', 'coffee'];
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('List of courses'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
        ),
        body: ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) {
            return ListTile(
              leading: const Icon(Icons.shopping_cart),
              title: Text(products[index]),
            );
          },
        ),
      ),
    );
  }
}