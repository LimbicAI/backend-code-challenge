import moment from 'moment';
import { BadRequestError } from '../../common/error';
import { endDateGreater } from '../../common/utils';
import { IPost } from '../../database/models/interfaces';
import postModel from '../../database/models/post.model';
// import userModel from '../../database/models/user.model';

import { CreatePostDto, IQueryPosts, IAuthor } from './post.dto';



class PostService {
    async create(data: CreatePostDto, authorId: string): Promise<Partial<IPost | void>> {
        const createPost = new postModel({ ...data, author: authorId });
        await createPost.save();
        const responseResponse = createPost as IPost;
       
        return { title: responseResponse.title, content: responseResponse.content}

    }

    async fetchAll(user_id: string, data: IQueryPosts) {


        const today = moment().format("YYYY-MM-DD");
        const yesterday = moment().add(-1, 'days').format("YYYY-MM-DD");

        //If date is not passed, use today and yesterday as filter rang
        const { limit = 5, start = yesterday, end = today } = data;

        //Check if start date is not greater than end date
        const isEndDateGreater = endDateGreater(`${start}`, `${end}`);

        if (!isEndDateGreater) {
            throw new BadRequestError('End date must be greater than or equals to start date');
        }
        // Limit fetch so not to slow the system dwomn.. Imagine user wants to fetch like 1k records, that can slow down the DB
        if (limit > 200) {
            throw new BadRequestError('LIMIT RANGE ERROR')
        }


        const retrieveUSersPost = await postModel.find({
            author: user_id, createdAt: {
                //PAD DATE 
                $gte: `${start} 00:00:00`,
                $lte: `${end} 23:59:59`
            }
        }).sort({ createdAt: -1 }).populate('author').limit(limit).exec();

        const author: IAuthor = {}
        const posts = retrieveUSersPost.map((post: IPost) => {
            author.username = post.author.username
            author.email = post.author.email
            return { title: post.title, content: post.content }
        })
        const fii = await postModel.find({}).exec();
        console.log(fii,"PPP>>>", user_id)
    //Incase use does not have any post, its okay to still return the empty array because frontend might need it for display
        return { author, posts }

    }

}


export default new PostService();