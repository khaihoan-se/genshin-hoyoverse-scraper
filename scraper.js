import axios from 'axios'
import cheerio from 'cheerio'
import dotenv from 'dotenv'
import { colorCharacteFind, randomPrice } from './utils.js'
dotenv.config();

const genshinImpactDetailsUrl = 'https://genshin-impact.fandom.com/wiki';
const playstationUrl = 'https://www.playstation.com/en-vn/games/genshin-impact';
const genshinImpactUrl = 'https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki';

// Get Key Features
export const getKeyFeatures = async () => {
    const keyFeatures = [];
    const { data: html } = await axios(playstationUrl);
    const $ = cheerio.load(html);
    $('#key-features.section--light .box', html).each(function () {
        const image = $(this).find('.imageblock .media-block').attr('data-src');
        const title = $(this).find('.textblock.parbase .text-block h4').text();
        const description = $(this).find('.textblock.parbase .text-block p').text();

        keyFeatures.push({
            image: image,
            title: title,
            description: description
        })
    })
    const newKeyFeatures = keyFeatures.reduce((acc, item) => {
        const { image, title, description } = item;
        image !== undefined && title !== '' && description !== '' && acc.push({
            image: image,
            title: title,
            description: description
        })
        return acc
    }, [])
    return newKeyFeatures;
}

const getCharacter = async (linkDetail) => {
    const coverImages = [];
    const { data: html } = await axios(genshinImpactDetailsUrl + linkDetail);
    const $ = cheerio.load(html);
    $('.pi-image-collection.wds-tabber .wds-tab__content', html).each(function() {
        const image = $(this).find('a').attr('href').split('/revision')[0];
        coverImages.push(image)
    })
    const description = $('.page-content .mw-parser-output p+p').text();
    return {
        coverImages: coverImages,
        description: description
    }
}
// Get All Character
export const getAllCharacter = async () => {
    const listCharacter = [];
    const { data: html } = await axios(genshinImpactUrl);
    const $ = cheerio.load(html);
    $('.card_container', html).each(function() {
        const thumbImage = $(this).find('.card_image a img').attr('data-src').split('/revision')[0];
        const nameCharacter = $(this).find('.card_image a').attr('title');
        const colorCharacter = $(this).attr('class').split(' ')[1];
        const linkDetail = $(this).find('.card_image a').attr('href').split('/wiki')[1];
        const elementElectro = $(this).find('.card_icon span a img').attr('data-src');
        listCharacter.push({
            linkDetail: linkDetail,
            nameCharacter: nameCharacter,
            colorCharacter: colorCharacteFind(colorCharacter),
            elementElectro: elementElectro === undefined ? undefined : elementElectro.split('/revision')[0],
            price: randomPrice(600, 6000),
            coverImage: {
                thumbImage: thumbImage,
            }
        })
    })
    const resuls = Promise.all(listCharacter.map( async (item) => {
        const { linkDetail } = item;
        const cardImage = await getCharacter(linkDetail);
        return {
            ...item,
            coverImage: {
                ...item.coverImage,
                cardImage: cardImage.coverImages[0],
                wishImage: cardImage.coverImages[1],
                inGameImage: cardImage.coverImages[2]
            },
            description: cardImage.description
        }
    }))
    return resuls;
}
