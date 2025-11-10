System = {
    _DEFAULT: {
        PEDS: {
            model: 'ig_dix',
            scenario: {
                name: 'WORLD_HUMAN_CLIPBOARD',
                freeze: true,
                oblivious: true,
            },
        },
        INTERACTIONS: {
            take: {
                label: 'Take A Out',
                icon: 'fas fa-car',
                distance: 3,
            },
            return: {
                label: 'Return Vehicle',
                icon: 'fas fa-warehouse',
            },
            targets: {
                job: {
                    police: 0
                },
                gang: {
                    ballas: 0
                }
            },
            debug: false
        },
        MENU: {
            main: {
                browse: {
                    header: 'Police Patrol',
                    txt: 'Browse police vehicles',
                    icon: 'fas fa-car',
                },
                preview: {
                    header: 'Preview Vehicle',
                    txt: 'Preview Vehicle',
                    icon: 'fas fa-eye',
                },
                exit: {
                    header: 'Exit',
                    icon: 'fas fa-times'
                }
            },
            subMain: {
                list: {
                    header: 'Police Patrol',
                    txt: 'Take a Patrol',
                    icon: 'fas fa-car',
                },
                preview: {
                    header: 'Preview Vehicle',
                    txt: 'Preview Vehicle',
                    icon: 'fas fa-eye',
                },
                return: {
                    header: 'back',
                    icon: 'fas fa-arrow-left',
                }
            },
        }
    },
    losSantos: {
        ITEM: 'configA',
        PEDS: {
            peds: [
                {
                    coords: [454.0, -1023.25, 27.46, 47.41],
                }
            ],
        },
        VEHICLES: {
            spawn: [450.75, -1025.06, 28.56, 283.73],
            preview: {
                coords: [450.94, -1020.05, 28.43, 216.17],
                cam: {
                    coords: [451.42, -1025.71, 28.55],
                    rotation: {
                        verticalrotate: -10.00,
                        horizontalrotate: 0.00,
                        left_n_right: 8.14,
                    },
                    fov: 40.0
                }
            },
        }
    },
    sandyShores: {
        ITEM: 'configB',
        PEDS: {
            peds: [
                { coords: [1828.33, 3671.63, 34.34, 71.09] }
            ],
        },
        VEHICLES: {
            spawn: [1815.27, 3665.58, 33.59, 298.07],
            preview: {
                coords: [1815.22, 3665.56, 33.93, 303.8],
                cam: {
                    coords: [449.97, -1021.67, 27.44],
                    rotation: {
                        verticalrotate: -10.00,
                        horizontalrotate: 0.00,
                        left_n_right: 161.84,
                    },
                    fov: 100.00
                }
            },
        }
    },
    paletoBay: {
        ITEM: 'configB',
        PEDS: {
            peds: [
                { coords: [-460.89, 6051.23, 31.34, 174.82] }
            ],
        },
        VEHICLES: {
            spawn: [-460.64, 6046.97, 30.76, 132.34],
            preview: {
                coords: [-448.14, 5994.5, 31.15, 265.16],
                cam: {
                    coords: [-443.54, 5997.72, 32.45],
                    rotation: {
                        verticalrotate: -10.00,
                        horizontalrotate: 0.00,
                        left_n_right: 161.84,
                    },
                    fov: 100.00
                }
            },
        }
    }
},
Items = {
    _DEFAULT: {
        registerable: false,
        allowed: { police: 0 },
        price: 500,
        plate: ['LENIX', 100, 999],
        style: { isDisabled: false, livery: 0, rgb: [81, 84, 89] },
        image: '',
        warp: false,
        clearOnLeave: true
    },
    configA: [
        { vehicle: 'police' },
        { vehicle: 'police2' },
        { vehicle: 'police3' },
    ],
    configB: [
        { vehicle: 'sultan' },
        { vehicle: 'sultan2' },
        { vehicle: 'neon' },
        { vehicle: 'vstr' },
    ],
}