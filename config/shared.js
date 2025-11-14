System = {
    _DEFAULT: {
        PEDS: {
            hash: GetHashKey('ig_dix'),
            scenario: {
                name: 'WORLD_HUMAN_CLIPBOARD',
                freeze: true,
                oblivious: true,
            },
        },
        INTERACTIONS: {
            take: {
                label: 'Access Vehicles',
                icon: 'fas fa-car',
                distance: 3,
            },
            return: {
                label: 'Return The Vehicle',
                icon: 'fas fa-warehouse',
            },
            targets: {},
            debug: false
        },
        MENU: {
            main: {
                browse: {
                    title: 'Vehicles',
                    icon: 'fas fa-car',
                },
                preview: {
                    title: 'Preview Vehicles',
                    icon: 'fas fa-eye',
                },
                exit: {
                    title: 'Exit',
                    icon: 'fas fa-times'
                }
            },
            subMain: {
                list: {
                    title: 'Police Patrol',
                    descriptions: {
                        get: ['Get: ', 'For: $'],
                        take: 'Take Out ',
                    },
                    icons: {
                        get: 'fas fa-key',
                        buy: 'fas fa-dollar-sign'
                    },
                    disabled: 'You are not eligable for this vehicle'
                },
                preview: {
                    title: 'Preview: ',
                    icon: 'fas fa-eye',
                },
                return: {
                    title: 'back',
                    icon: 'fas fa-arrow-left',
                }
            },
        }
    },
    LosSantos: {
        ITEM: 'patrols',
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
                isDisabled: true,
                coords: [450.94, -1020.05, 28.43, 216.17],
                cam: {
                    coords: [451.42, -1025.71, 28.55],
                    rotation: {
                        verticalrotate: -10.00,
                        horizontalrotate: 0.00,
                        left_n_right: 356.20,
                    },
                    fov: 40.0
                }
            },
        },
        MENU: {
            main: {
                browse: {
                    title: 'Los Santos Patrols'
                }
            }
        },
        INTERACTIONS: {
            take: {
                label: 'Access Patrols',
            },
            targets: {}
        }
    },
    SandyShores: {
        ITEM: 'patrols',
        PEDS: {
            peds: [
                { coords: [1854.5, 3680.49, 34.27, 213.87] }
            ],
        },
        VEHICLES: {
            spawn: [1815.27, 3665.58, 33.59, 298.07],
            preview: {
                coords: [1854.15, 3675.38, 33.15, 208.48],
                cam: {
                    coords: [1859.55, 3673.18, 33.77],
                    rotation: {
                        verticalrotate: -10.00,
                        horizontalrotate: 0.00,
                        left_n_right: 72.96,
                    },
                    fov: 45.00
                }
            },
        },
        INTERACTIONS: {
            targets: {
                job: {
                    police: 0,
                }
            }
        }
    },
    Ballas: {
        ITEM: 'gangs',
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
        },
        INTERACTIONS: {
            targets: {
                gang: {
                    ballas: 0,
                }
            }
        }
    }
},
Items = {
    _DEFAULT: {
        registerable: false,
        allowed: {},
        disallowed: {},
        price: 500,
        plate: ['LENIX', 100, 999],
        style: {
            isDisabled: false,
            livery: 0,
            rgb: [81, 84, 89]
        },
        image: '',
        warp: false,
        clearOnLeave: false
    },
    patrols: [
        {
            vehicle: 'police',
            allowed: {
                job: {
                    police: 1
                }
            },
            /* disallowed: {
                gang: {
                    ballas: 0
                }
            } */
        },
        { vehicle: 'police2' },
        { vehicle: 'police3' },
    ],
    gangs: [
        { vehicle: 'sultan' },
        { vehicle: 'sultan2' },
        { vehicle: 'neon' },
        { vehicle: 'vstr' },
    ],
}