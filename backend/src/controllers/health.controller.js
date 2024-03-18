const health = async (req, res) => {

    return res.status(200).json({
        statusCode: 200,
        message: "Everything is done"
    })
}

export {
    health
}