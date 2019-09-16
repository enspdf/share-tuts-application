import * as SparkPost from "sparkpost";
const sparkPostApiKey = process.env.SPARKPOST_API_KEY || "071e99afe2a9c9f90f8463d38a41d232e9aa0236";
console.log(sparkPostApiKey)
const client = new SparkPost(sparkPostApiKey);

export const sendEmail = async (recipient: string, url: string) => {
    const response = await client.transmissions.send({
        options: {
            sandbox: true
        },
        content: {
            from: "testing@sparkpostbox.com",
            subject: "Confirm Email",
            html: `
                <html>
                    <body>
                        <a href="${url}">Confirm Email</a>
                    </body>
                </html>
            `
        },
        recipients: [{ address: recipient }]
    });

    console.log(response);
    console.log(url);
}