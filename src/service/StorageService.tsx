import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {

    static async getData(key : string){
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                //this.setState({ storedValue: value });
            }
        } catch (e) {
            console.error('Error reading value from AsyncStorage');
        }
    };

    static async getAll() {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const items = await AsyncStorage.multiGet(keys);
          return items.map(item => JSON.parse(item[1]));
        } catch (error) {
          console.error(error);
          return null;
        }
    }

    static async post(key:string, value:string) {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    static async updateData(key : string, data : any){
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data),);
        } catch (error) {
            console.error(error)
        }
    }
  
    static async delete(key:string) {
      try {
        await AsyncStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  
    static async clean(){
        try {
            await AsyncStorage.clear();
            return true;
        } catch (error) {
            console.error(error)
            return false;
        }
    }
  }
  
  export default StorageService;