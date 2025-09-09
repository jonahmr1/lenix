return {
    garbage = {
        name = "Garbage Collection",
        position = "Sanitation Worker",
        description = "Collect and dispose of waste materials throughout the city to keep the streets clean and maintain public health standards.",
        category = "Public Services",
        icon = "fas fa-trash",
        enabled = true,
        repGrades = {
            [0] = 1,
            [1] = 10,
            [2] = 20,
            [3] = 40,
            [4] = 60,
        },
        repMultiplier = 1.1,
        difficultyMultiplierThresHold = 25,
        repTypes = {
            ['highend'] = 6,
            ['high'] = 7,
            ['average'] = 8,
            ['low'] = 9,
            ['lowend'] = 10,
        },
        maxXP = 100,
        location = { x = -322.24, y = -1546.02, z = 30.02 },
        requirements = {
            license = true
        },
        image = {
            type = "url",
            content = "https://cdn.discordapp.com/attachments/1406729989084418160/1409908188764962938/image.png?ex=68af16d3&is=68adc553&hm=447dc0a23f82c1a3a969e11bfc6d7389992a406bda254c785141fcb90a38613e&"
        },
        stats = { payment = "", paymentLabel = "", availability = "", availabilityLabel = "" }
    },
    tow = {
        name = "Towing Service",
        position = "Tow Truck Driver",
        description = "Provide roadside assistance and vehicle towing services to help stranded motorists and clear traffic incidents.",
        category = "Emergency Services",
        icon = "fas fa-truck",
        enabled = true,
        repGrades = {
            [0] = 1,
            [1] = 25,
            [2] = 50,
        },
        repMultiplier = 1.1,
        difficultyMultiplierThresHold = 25,
        repTypes = {
            ['highend'] = 6,
            ['high'] = 7,
            ['average'] = 8,
            ['low'] = 9,
            ['lowend'] = 10,
        },
        maxXP = 100,
        location = { x = 909.0, y = -177.4, z = 74.2 },
        requirements = {
            license = true
        },
        image = {
            type = "url",
            content = "https://cdn.discordapp.com/attachments/1406729989084418160/1410006774022406154/image.png?ex=68b0c423&is=68af72a3&hm=36f50af509543740171ccc1969cc74daa396f3d785c8fbcd8cfabb6018bde0f8&"
        },
        stats = { payment = "", paymentLabel = "", availability = "", availabilityLabel = "" }
    },
}
