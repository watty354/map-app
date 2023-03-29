export const navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* ここにカスタマイズしたいアイコンやコンポーネントを配置 */}
        </TouchableOpacity>
      ),
    };
  };
