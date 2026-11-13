import json

reviews = [
    {
        "id": "rev-01",
        "name": "Ranjith",
        "rating": 5,
        "text": "",
        "hasPhotos": True,
        "photoNote": "Photo review on Google Maps",
        "source": "Google Review",
        "relativeTime": "Verified Visitor"
    },
    {
        "id": "rev-02",
        "name": "Bagom Sahana",
        "rating": 5,
        "text": "Best shop\nHas large variety of milton flask\nVaya waterbottle at best price\nAlso kids cradle walker at reasonable price",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-03",
        "name": "ramya rami",
        "rating": 5,
        "text": "பெஸ்ட்\nGood friendly support\nBest customer service",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-04",
        "name": "Ra Fi",
        "rating": 5,
        "text": "Must visit shop all kids toys\nThese guys are amazing\nThey have wide range of rc cars",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-05",
        "name": "Harifa Afrose",
        "rating": 5,
        "text": "Best shop u name it u get it best shop in Vellore for kids jeep bike and all best collection available here",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-06",
        "name": "Logesh K",
        "rating": 5,
        "text": "Toy shop in vellore best for kids has many keychains die cast mini rc car best",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-07",
        "name": "R R",
        "rating": 5,
        "text": "Very good Shop and a lot of kids toys available here. Staffs are also very helpful",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-08",
        "name": "Sumithra Ramamoorthy",
        "rating": 5,
        "text": "Best shop\nTaught of coming days today I came and saw many collection here",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-09",
        "name": "Manash Chowdhury",
        "rating": 5,
        "text": "very good response\nvery good explanation of toys\nbags good quality products available",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-10",
        "name": "Molla sohrab Hossain",
        "rating": 5,
        "text": "Very friendly staff at designs shopee\nHas a good collection of resin art kids bean bag\nBest in vellore for toys",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-11",
        "name": "Roshini Antony Prabakaran",
        "rating": 5,
        "text": "A really impressive collection of toys, with a wide variety of options to choose from. The staff are very friendly and helpful, and they happily show you the different toys and products available. Definitely worth a visit!",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-12",
        "name": "vijayvijayvijayvijay1818",
        "rating": 5,
        "text": "Had a really good shopping experience at this store. The collection is good and the prices are reasonable. I bought a raincoat and some toys for kids, and I was happy with the quality and variety available. The staff were friendly and helpful.",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-13",
        "name": "Dharshan Kumar",
        "rating": 5,
        "text": "Best hot wheels kids toy cars store in Vellore with orange colour borad",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-14",
        "name": "Perumal Moorthy",
        "rating": 5,
        "text": "Good bike car\nJeep\nAll toys",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-15",
        "name": "Hussain Y",
        "rating": 5,
        "text": "Big toys shop in vellore\nHad a great experience visiting store one of the best in vellore",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-16",
        "name": "Riyas Riyas",
        "rating": 5,
        "text": "Very good response they gave\nHad good collection of kids jeep bike car",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-17",
        "name": "Md Ibrahim",
        "rating": 5,
        "text": "Kids shop has best kids fancy dress\nYoga mat\nKids rc car\nBike jeep in vellore",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-18",
        "name": "Anbu Electronics",
        "rating": 5,
        "text": "I satisfied in design shop at Vellore. Once again we will visit the shop for their way of purchase.",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-19",
        "name": "Mayan Rahman",
        "rating": 5,
        "text": "best bag shop in vellore\nvarious toys available\ngave good customer service\nBlack travel duffel bag",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-20",
        "name": "Shoma Rani Ray",
        "rating": 5,
        "text": "All items available at reasonable price\nOne of the best in vellore",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-21",
        "name": "Rashidha Ashik",
        "rating": 5,
        "text": "Good shop and Hand bag full collection and collage bag full collection and other and all items avalible",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-22",
        "name": "ashfaq ahmeed",
        "rating": 5,
        "text": "Good 👏 best ரவிஸ் ஆன் திஸ் ஷோ",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-23",
        "name": "Fazila Rabbi",
        "rating": 5,
        "text": "Has best variety of kids jeep\nBike\nBeyblade yoyo collection\nAlso kids slide",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-24",
        "name": "Palani Palani",
        "rating": 5,
        "text": "Kids slide has a good collection with reasonable price many good collection ate available",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-25",
        "name": "Praveen Kumar",
        "rating": 5,
        "text": "I bought the baby cradle here. Best quality and affordable price from online. Having good collection for babies",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-26",
        "name": "Dharshini Deva",
        "rating": 5,
        "text": "Good quality and more things available in one shop",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-27",
        "name": "Santhiya e",
        "rating": 5,
        "text": "Best kids magic car swing car\nBaby car toys shopping vellore\nVellore best kids jeep bike stores",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-28",
        "name": "Pradhap",
        "rating": 5,
        "text": "The experience is good and here sales people give good service",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-29",
        "name": "Somu K",
        "rating": 5,
        "text": "Good nice shopee ni vellaro best shope too kid and I like the rest 🥰😘😘😍🥰🥰🙏🙏🙏🙏🤝🤝🤝🤝👍👍👍👌👌👌👌👌",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    },
    {
        "id": "rev-30",
        "name": "Usman",
        "rating": 5,
        "text": "Good shop and Hand bag\nJeep\nKids slide",
        "hasPhotos": False,
        "source": "Google Review",
        "relativeTime": "Verified Customer"
    }
]

with open('src/data/reviews.json', 'w', encoding='utf-8') as f:
    json.dump(reviews, f, ensure_ascii=False, indent=2)

print(f"Generated src/data/reviews.json with {len(reviews)} reviews.")

