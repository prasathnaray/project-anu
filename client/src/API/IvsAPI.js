import axios from 'axios';
import APP_URL from './config';


function IvsAPI(){
    const result = axios.get(APP_URL+'/api/v1/ivs-ind')
    return result
}
