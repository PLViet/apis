const { drawCard } = require('discord-welcome-card');
module.exports = async(req, res) => {
    try {
    var title = req.query.title,
     text1 = req.query.text,
     subtitle = req.query.subtitle,
     image1 = req.query.avatar,
     background = req.query.background
    const image = await drawCard({
        theme: "circuit",
        text: {
            title: `${title}`,
            text: `${text1}`,
            subtitle: `${subtitle}`,
            color: `#FFFFFF`
        },
        avatar: {
            image: `${image1}`,
            outlineWidth: 5,
        },
        background: `${background}`,
        blur: 1,
        border: true,
        rounded: true
    })
        res.set({ 'Content-Type': 'image/gif' })
    res.send(image)
  } catch {
    res.json({error:{
      message: "Đã xảy ra lỗi",
      example: "https://xuantruong.dev/banner/welcome?title=Thiệu Trung Kiên&text=DÒNG THỨ 2&subtitle=DÒNG THỨ 3&avatar=https://i.imgur.com/546XCz8.png&background=https://i.imgur.com/gMvAreh.jpg"
    }
    })
  }
 
}