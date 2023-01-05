/**
 * This function throws an error if the given variables are not found in the process environment variables
 * @param requiredVars The required environment variables as found in process.env
 */
 export const checkEnvVars = (requiredVars: Array<string>) => {
    const varsNotPresent = requiredVars.filter((theVar: string) => {
      return (
        process.env[theVar] === null ||
        process.env[theVar] === undefined ||
        process.env[theVar] === ''
      );
    });
    const absentVars = varsNotPresent.join(', ');
    if (varsNotPresent.length > 0) throw new Error(`Nullish configuration variables: ${absentVars}`);
  };
  
  /**
   * Checks if a variable has the accepted value
   * @param variableKey The key of the variable
   * @param validValues The accepted values for the variable
   */
export const checkValidConfig = (variableKey: string, validValues: Array<string | undefined>) => {
  const isValid = validValues.some((validValue: string) => {
    return process.env[variableKey] === validValue;
  });
  if (!isValid) throw new Error(`Invalid value given for environment configuration ${variableKey}`);
};