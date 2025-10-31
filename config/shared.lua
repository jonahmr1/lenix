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
        image = {
            type = "img",
            content = "public/garbage.jpg"
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
        image = {
            type = "img",
            content = "public/tow.jpeg"
        },
        stats = { payment = "", paymentLabel = "", availability = "", availabilityLabel = "" }
    },
}
